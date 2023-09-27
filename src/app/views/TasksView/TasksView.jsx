// eslint-disable-next-line unicorn/no-abusive-eslint-disable
/* eslint-disable */
/*

  Task
    Task
    Task


  List
    ListHeader
      Column  Column  Column
    Item
      Row
        Cell  Cell  Cell


 */

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import cx from "./TasksView.module.scss";
import throttle from "lodash.throttle";
import { uniqueId } from "lodash";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeTree } from "react-vtree";
import List2 from "./List/List";
import items from "./data.json";

const definition = {
  "id": {
    name: "ID",
    order: 0
  },
  "name": {
    name: "Name",
    order: 1
  },
  "age": {
    name: "Age",
    order: 2
  },
  "race": {
    name: "Race",
    order: 3
  },
  "alignment": {
    name: "Alignment",
    order: 4
  },
  "sex": {
    name: "Sex",
    order: 5
  },
  "lightsaber_color": {
    name: "Lightsaber Color",
    order: 6
  }
};

const items2 = [
  ...items,
  ...items.map(item => ({ ...item, id: +item.id + 76 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 2 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 3 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 4 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 5 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 6 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 7 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 8 })),
  ...items.map(item => ({ ...item, id: +item.id + 76 * 9 })),
]


const taskDefinition = {
  "id": {
    name: "ID",
    order: 0
  },
  "name": {
    name: "Name",
    order: 1
  },
  "details": {
    name: "Details",
    order: 2
  },
  "due-date": {
    name: "Due Date",
    order: 3
  },
  "start-date": {
    name: "Start Date",
    order: 4
  },
  "creator": {
    name: "Creator",
    order: 5,
    value: ({ firstName, lastName }) => `${firstName} ${lastName}`
  }
};


const convertTask = (task) => {
  return {
    "id": task.identifier,
    "name": task.description ?? "",
    "details": task.details ?? "",
    "due-date": task.dueDate ?? "",
    "start-date": task.startDate ?? "",
    "creator": task.creator ?? "",
    "children": task.subtasks && task.subtasks.length
      ? task.subtasks.map(subtask => convertTask(subtask))
      : []
  }
}

const fetcher = (i) => {
  return fetch(`https://api-dev.dockhealth.app/heydoc-services/task/findListTasksByTaskGroup/73baa05a-a77d-11eb-9858-0e3d2d599b61/7f2c0488-a77d-11eb-9858-0e3d2d599b61?status=INCOMPLETE&startPosition=${30 * i}&endPosition=0`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer eyJraWQiOiJOcENrVDNtS1wvOXlwNUFUTFRzaVR2WkNFZ0JSNDBjbVB2T3dSUTY5eEFEVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMzg5ZmI1OC05ZTdhLTQ4NmYtODg3My0zYjMyZjY1NmFiYmUiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzk1MjlhYTBjLTI4YjMtNDY0ZS04MjE5LTJmMTBmZmRiMDQwNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTM4MzY0NzEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1hQbTZnZTFBbCIsImV4cCI6MTY5NTg0NDc4NSwiaWF0IjoxNjk1ODAxNTg1LCJqdGkiOiI1NDlkY2JlMy0zNjhmLTRkMTAtYjdlMy1kOWM5YTk0MTNlYTMiLCJjbGllbnRfaWQiOiI2dG05OW5yamM1Z3RuNW5oc29scmE4YzNxbiIsInVzZXJuYW1lIjoibWF0ZXVzei5waWV0cnpha0BodGRldmVsb3BlcnMuY29tIn0.awVP9UwFLI2WDSQPoLnyRz69X4TFq1NRZzC4mruVjkW_Fq3fO8hRhLoXX-2ZOVboo3vOv5q4YFnNCJX74DZuTqb8Tafg1gU0uAs1mcYt43snrNA_clQK4v-cuSDPdyVntuaO3NMLAWM8E87uKb5ELEQ7elDpl3A3DsrNuHloDMun1KclkRKmTGs71w-NfnsOngp3cTujbKWZ5wmeGFXSWBaRVlPcGIi5a7pDYa7nx2eFwGUL7tABWsqYznqzCOj2zyGv4d1oGLWNuArWPB8tCW_xHQZxNhwv2g0RUokp1RiS7m9vZl48gqZbCgFUXgSrbE7PTHMjwNjY-rIB-yiVgA"
    }
  })
    .then(response => response.json())
}

const fetchSubtasks = (taskIdentifier) => {
  return fetch(`https://api-dev.dockhealth.app/heydoc-services/task/${taskIdentifier}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer eyJraWQiOiJOcENrVDNtS1wvOXlwNUFUTFRzaVR2WkNFZ0JSNDBjbVB2T3dSUTY5eEFEVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMzg5ZmI1OC05ZTdhLTQ4NmYtODg3My0zYjMyZjY1NmFiYmUiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzk1MjlhYTBjLTI4YjMtNDY0ZS04MjE5LTJmMTBmZmRiMDQwNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTM4MzY0NzEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1hQbTZnZTFBbCIsImV4cCI6MTY5NTg0NDc4NSwiaWF0IjoxNjk1ODAxNTg1LCJqdGkiOiI1NDlkY2JlMy0zNjhmLTRkMTAtYjdlMy1kOWM5YTk0MTNlYTMiLCJjbGllbnRfaWQiOiI2dG05OW5yamM1Z3RuNW5oc29scmE4YzNxbiIsInVzZXJuYW1lIjoibWF0ZXVzei5waWV0cnpha0BodGRldmVsb3BlcnMuY29tIn0.awVP9UwFLI2WDSQPoLnyRz69X4TFq1NRZzC4mruVjkW_Fq3fO8hRhLoXX-2ZOVboo3vOv5q4YFnNCJX74DZuTqb8Tafg1gU0uAs1mcYt43snrNA_clQK4v-cuSDPdyVntuaO3NMLAWM8E87uKb5ELEQ7elDpl3A3DsrNuHloDMun1KclkRKmTGs71w-NfnsOngp3cTujbKWZ5wmeGFXSWBaRVlPcGIi5a7pDYa7nx2eFwGUL7tABWsqYznqzCOj2zyGv4d1oGLWNuArWPB8tCW_xHQZxNhwv2g0RUokp1RiS7m9vZl48gqZbCgFUXgSrbE7PTHMjwNjY-rIB-yiVgA",
      "Currentorganizationidentifier": "160f8db5-40c2-11ea-a4e8-124feabd863a"
    }
  })
    .then(response => response.json())
}

const invokeUltimateFetcher = () => {
  const fetches = []
  for (let i = 0; i < 11; i++) {
    fetches.push(fetcher(i))
  }

  return Promise.all(fetches)
    .then((data) => {
      return data.reduce((accumulator, data) => {
        accumulator.push(...data.taskGroups[0].tasks)
        return accumulator
      }, [])
    })
    .then((tasks) => {
      const ids = []
      return tasks
        .filter((task) => {
          if (task.identifier === undefined) {
            return false
          }
          if (ids.includes(task.identifier)) {
            return false
          }
          ids.push(task.identifier)
          return true
      })
    })
    .then((tasks) => {
      const tasksWithSubtasksPromises = tasks
        .filter(task => task.subTasksCount > 0)
        .map(task => fetchSubtasks(task.identifier))
      return Promise.all(tasksWithSubtasksPromises).then((tasksWithSubtasks) => {
        const tasksWithSubtasksIds = tasksWithSubtasks.map(tasksWithSubtask => tasksWithSubtask.identifier)
        return tasks.map(task => {
          if (tasksWithSubtasksIds.includes(task.identifier)) {
            return tasksWithSubtasks
                .find(tasksWithSubtask => tasksWithSubtask.identifier === task.identifier)
          }
          return task
        })
      })
        .then((tasks) => {
          return tasks.map((task) => {
            return convertTask(task);
          })
        })
    })
}



export default function TasksView() {
  const [isLoading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    invokeUltimateFetcher()
      .then(tasks => {
        console.log(tasks);
        setTasks(tasks)
        setLoading(false)
      })
  }, [])
  return (
    <View>
      {!isLoading && <List2
        definition={taskDefinition  }
        items={tasks}
      />}
      {/* <TreePresenter itemSize={40}/> */}
    </View>
  );
}

function View({ children }) {
  return (
    <main className={cx.View}>
      {children}
    </main>
  );
}

// const Context = createContext({
//   cell: {
//     register: () => undefined
//   },
//   column: {
//     update: () => undefined,
//     size: () => undefined
//   }
// });

const Context = createContext({
  emit: () => undefined,
  registerCell: (column) => (updaters) => undefined,
  data() {
    return {};
  }
});

const useListAPI = () => {
  const { cell, column } = useContext(Context);
  return { cell, column };
};

const useMergeRefs = (...refs) => {
  return (element) => {
    for (const ref of refs) {
      if (ref) {
        ref.current = element;
      }
    }
  };
};

const innerElementType = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div className={cx.List} {...props}>
      <div className={cx.Header}>
        {Object.entries(definition).map(([field, descriptor]) => (
          <Column key={field} id={field} order={descriptor.order}>{descriptor.name}</Column>
        ))}
      </div>
      <ul>
        {children}
      </ul>
    </div>
  )
})

function List({ definition, items }) {
  const order = useRef(
    Object.entries(definition)
      .sort(([, descriptorA], [, descriptorB]) =>
        descriptorA.order - descriptorB.order)
      .map(([field]) => field)
  );
  const list = useRef(new Map());

  const cell = {
    register: (column) => (updaters) => {
      if (!list.current.has(column)) {
        list.current.set(column, new Map());
      }
      const cells = list.current.get(column);
      for (const [name, updater] of Object.entries(updaters)) {
        if (cells.has(name)) {
          cells.get(name).push({ updater, state: {} });
        } else {
          cells.set(name, [{ updater, state: {} }]);
        }
      }
    }
  };

  const column = {
    size: (column) => {
      const a = list.current.get(column)
      const b = a?.get("resize")
      console.log(column, a, b);
      return b
    },
    update: (column) => (event, payload) => {
      const details = list.current.get(column).get(event);
      switch (event) {
        case "drag":
          for (const { updater } of details) {
            updater(payload);
          }
          break;
        case "resize":
          for (const { updater, state } of details) {
            updater(payload);
            state.size = payload;
          }
          break;
        case "order":
          const indexOf = order.current.indexOf(column);
          const [item] = order.current.splice(order.current.indexOf(column), 1);
          order.current.splice(indexOf + payload, 0, item);
          for (const [id, column] of list.current) {
            for (const { updater } of column.get("order")) {
              updater(order.current.indexOf(id));
            }
          }
          break;
        default:
      }
      // const updaters = state.current.get(column).get(event);
      // if (updaters) {
      //   for (const updater of updaters) {
      //     updater(payload);
      //   }
      // }
    }
  };


  return (
    <Context.Provider value={{
      cell,
      column
    }}>
      {/* <div className={cx.List}> */}
      {/*   /!* <Header/> *!/ */}
      {/*   <div className={cx.Header}> */}
      {/*     {Object.entries(definition).map(([field, descriptor]) => ( */}
      {/*       <Column key={field} id={field} order={descriptor.order}>{descriptor.name}</Column> */}
      {/*     ))} */}
      {/*   </div> */}
      {/*   <ul> */}
          {/* <AutoSizer disableWidth> */}
          {/*   {({ height }) => ( */}
              <FixedSizeTree
                treeWalker={treeWalker}
                itemSize={40}
                height={640}
                width="100%"
                innerElementType={innerElementType}
              >
                {Item}
              </FixedSizeTree>
            {/* )} */}
          {/* </AutoSizer> */}
          {/* {items.map((record) => ( */}
          {/*   <Item key={record.id} definition={definition} record={record} /> */}
          {/* ))} */}
      {/*   </ul> */}
      {/* </div> */}
    </Context.Provider>
  );
}

const convert = (node, nestingLevel) => ({
  data: {
    id: node.id.toString(),
    name: node.name,
    isOpenByDefault: true,
    isLeaf: node.children === undefined || node.children.length === 0,
    nestingLevel,
    record: node
  },
  nestingLevel,
  node
})
function* treeWalker() {
  for (const item of items2) {
    yield convert(item, 0);
  }

  // yield getNodeData(rootNode, 0);
  //
  // while (true) {
  //   const parentMeta = yield;
  //
  //   for (let i = 0; i < parentMeta.node.children.length; i++) {
  //     yield getNodeData(
  //       parentMeta.node.children[i],
  //       parentMeta.nestingLevel + 1,
  //     );
  //   }
  // }
}

const Node = ({ data: {isLeaf, name, nestingLevel}, isOpen, style, setOpen }) => (
  <div
    style={{
      ...style,
      alignItems: 'center',
      display: 'flex',
      marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
    }}
  >
    {!isLeaf && (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          style={defaultButtonStyle}
        >
          {isOpen ? '-' : '+'}
        </button>
      </div>
    )}
    <div style={defaultTextStyle}>{name}</div>
  </div>
);

function Header() {
  return (
    <div className={cx.Header}>
      <Column id={0} order={0}>Text Column 1</Column>
      <Column id={1} order={1}>Text Column 2 sad asdasdsaadsadsads asdsd adsd assadasadsda asd asd</Column>
      <Column id={2} order={2}>Text Column 3</Column>
      <Column id={3} order={3}>Text Column 4</Column>
      <Column id={4} order={4}>Text Column 5</Column>
      {/* <Column id={5} order={5}>Text Column 6</Column> */}
      {/* <Column id={6} order={6}>Text Column 7</Column> */}
    </div>
  );
}


function Column({ children, id, order }) {
  const { cell, column } = useListAPI();
  const element = useRef(null);

  return (
    <>
      <Cell ref={element} register={cell.register(id)} order={order}>{children}</Cell>
      <Handle owner={element} register={cell.register(id)} updater={column.update(id)} order={order} />
      <Resizer owner={element} register={cell.register(id)} updater={column.update(id)} order={order} />
    </>
  );
}

function Item({ data: {isLeaf, name, nestingLevel, record}, isOpen, style, setOpen }) {
  const { cell, column } = useListAPI();

  return (
    <li className={cx.Row} style={{
      ...style,
      alignItems: 'center',
      display: 'flex',
      marginLeft: nestingLevel * 30,
    }}>
      {Object.entries(record).map(([field, value]) => {
        const descriptor = definition[field];
        if (descriptor) {
          const { order } = definition[field];
          return (
            <Cell
              key={`${record.id}/${field}`}
              register={cell.register(field)}
              // updater={column.update(field)}
              order={order}
              width={column.size(field)}
            >
              {value}
            </Cell>
          );
        }
      })}
    </li>
  );

  // return (
  //   <li className={cx.Row}>
  //     <Cell register={cell.register(0)} order={0}>Text 1</Cell>
  //     <Cell register={cell.register(1)} order={1}>Text 2</Cell>
  //     <Cell register={cell.register(2)} order={2}>Text 3</Cell>
  //     <Cell register={cell.register(3)} order={3}>Text 4</Cell>
  //   </li>
  // );
}

const Cell = React.forwardRef(({ children, register, order, width }, ref) => {
  const id = useMemo(() => uniqueId(), []);
  const element = useRef(null);
  const merge = useMergeRefs(ref, element);

  useEffect(() => {
    register({
      resize: (payload) => {
        element.current.style.flexBasis = `${payload - element.current.offsetLeft}px`;
      },
      order: (payload) => {
        element.current.style.order = payload;
      },
      drag: (payload) => {
        element.current.style.transform = `translate3d(${payload.x}px, ${payload.y}px, 0)`;
        if (payload.x === 0) {
          element.current.style.backgroundColor = "";
          element.current.style.zIndex = "";
        } else {
          element.current.style.backgroundColor = "rgb(250, 250, 250)";
          element.current.style.zIndex = "1";
        }
      }
    });
  }, [register]);

  return (
    <div
      ref={merge}
      className={cx.Cell}
      style={{ order: order, flexBasis: width }}
      data-id={id}
    >
      {children}
    </div>
  );
});

function Resizer({ register, owner, updater, order }) {
  const element = useRef(null);
  const tracker = useRef(false);
  const offset = useRef(0);

  useEffect(() => {
    element.current.dataset.id = owner.current.dataset.id;
    register({
      order: (payload) => {
        element.current.style.order = payload;
      }
    });
  }, [register]);

  useEffect(() => {
    const handlePointerMove = throttle((event) => {
      if (tracker.current) {
        const value = event.pageX - offset.current + element.current.offsetWidth;
        updater("resize", value);
      }
    }, 25);
    const handlePointerUp = (event) => {
      element.current.releasePointerCapture(event.pointerId);
      tracker.current = false;
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (event) => {
    element.current.setPointerCapture(event.pointerId);
    tracker.current = true;
    offset.current = event.pageX - event.target.offsetLeft;
  };

  return (
    <i
      ref={element}
      className={cx.Resizer}
      onPointerDown={handlePointerDown}
      style={{ order: order }}
    />
  );
}

function Handle({ register, owner, updater, order }) {
  const element = useRef(null);
  const origin = useRef(null);
  const offset = useRef(0);

  const setOrigin = (event) => {
    origin.current = {
      owner: {
        offsetLeft: owner.current.offsetLeft,
        offsetWidth: owner.current.offsetWidth
      },
      element: {
        offsetLeft: element.current.offsetLeft,
        offsetWidth: element.current.offsetWidth
      }
    };
  };

  useEffect(() => {
    element.current.dataset.id = owner.current.dataset.id;
    register({
      order: (payload) => {
        element.current.style.order = payload;
      }
    });
  }, [register]);

  useEffect(() => {
    const state = {
      xPrevious: 0
    };

    const handlePointerMove = throttle((event) => {
      if (event.movementX === 0) {
        return;
      }
      if (origin.current) {
        const x = event.pageX - offset.current;
        const { owner, element } = origin.current;
        if (Math.abs(x - state.xPrevious) > 25) {
          updater("drag", { x: Math.round(x - element.offsetLeft), y: 0 });
        }
        const direction = event.movementX;
        if (direction === -1 && x <= owner.offsetLeft) {
          updater("order", -1);
          updater("drag", { x: 0, y: 0 });
          state.xPrevious = x;
        } else if (direction === 1 && x >= owner.offsetLeft + owner.offsetWidth) {
          updater("order", 1);
          updater("drag", { x: 0, y: 0 });
          state.xPrevious = x;
        }
        setOrigin();
      }
    }, 25);
    const handlePointerUp = (event) => {
      element.current.releasePointerCapture(event.pointerId);
      owner.current.style.backgroundColor = "";
      updater("drag", { x: 0, y: 0 });
      origin.current = null;
      state.xPrevious = 0;
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (event) => {
    element.current.setPointerCapture(event.pointerId);
    owner.current.style.backgroundColor = "rgb(250, 250, 250)";
    offset.current = event.pageX - event.target.offsetLeft;
    setOrigin(event);
  };

  return (
    <i
      ref={element}
      className={cx.Handle}
      onPointerDown={handlePointerDown}
      style={{ order: order }}
    />
  );
}


//[-

let nodeId = 0;

const createNode = (depth = 0) => {
  const node = {
    children: [],
    id: nodeId,
    name: `test-${nodeId}`,
  };

  nodeId += 1;

  if (depth === 5) {
    return node;
  }

  for (let i = 0; i < 10; i++) {
    node.children.push(createNode(depth + 1));
  }

  return node;
};

const rootNode = createNode();
const defaultTextStyle = {marginLeft: 10};
const defaultButtonStyle = {fontFamily: 'Courier New'};

const treeNodes = [
  {
    name: 'Root #1',
    id: 'root-1',
    children: [
      {
        children: [
          {id: 'child-2', name: 'Child #2'},
          {id: 'child-3', name: 'Child #3'},
        ],
        id: 'child-1',
        name: 'Child #1',
      },
      {
        children: [{id: 'child-5', name: 'Child #5'}],
        id: 'child-4',
        name: 'Child #4',
      },
    ],
  },
  {
    name: 'Root #2',
    id: 'root-2',
  },
];
const getNodeData = (
  node,
  nestingLevel
) => ({
  data: {
    id: node.id.toString(),
    name: node.name,
    isOpenByDefault: true,
    isLeaf: node.children === undefined || node.children.length === 0,
    nestingLevel
  },
  nestingLevel,
  node
});

// function* treeWalker(items) {
//   yield getNodeData(rootNode, 0);
//
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   while (true) {
//     const parentMeta = yield;
//
//     // eslint-disable-next-line @typescript-eslint/prefer-for-of
//     for (let i = 0; i < parentMeta.node.children.length; i++) {
//       yield getNodeData(
//         parentMeta.node.children[i],
//         parentMeta.nestingLevel + 1,
//       );
//     }
//   }
// }

// const Node = ({ data: {isLeaf, name, nestingLevel}, isOpen, style, setOpen }) => (
//   <div
//     style={{
//       ...style,
//       alignItems: 'center',
//       display: 'flex',
//       marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
//     }}
//   >
//     {!isLeaf && (
//       <div>
//         <button
//           type="button"
//           onClick={() => setOpen(!isOpen)}
//           style={defaultButtonStyle}
//         >
//           {isOpen ? '-' : '+'}
//         </button>
//       </div>
//     )}
//     <div style={defaultTextStyle}>{name}</div>
//   </div>
// );

const TreePresenter = ({ itemSize }) => (
  <AutoSizer disableWidth>
    {({ height }) => (
      <FixedSizeTree
        treeWalker={treeWalker}
        itemSize={itemSize}
        height={height}
        width="100%"
      >
        {Node}
      </FixedSizeTree>
    )}
  </AutoSizer>
);