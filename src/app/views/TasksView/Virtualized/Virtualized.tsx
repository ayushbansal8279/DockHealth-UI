import * as React from "react"
import { Virtuoso } from "react-virtuoso"
import cx from "./Virtualized.module.scss"
import { useCallback, useEffect, useState } from "react";
import { faker } from "@faker-js/faker"
import { debounce} from "lodash"

const data = (n: number) => {
  const data: any[] = []
  for (let i = 0; i < n; i++) {
    if (i % 50 === 0) {
      if (i !== 0) {
        data.push(
          {
            id: `ListFooter-${1000 + i}`,
            type: ListFooter,
            name: faker.lorem.paragraphs(1)
          }
        )
        data.push(
          {
            id: `LoadMore-${1000 + i}`,
            type: LoadMore,
            name: faker.lorem.paragraphs(1)
          }
        )
      }
      data.push(
        {
          id: `List-${1000 + i}`,
          type: List,
          name: faker.lorem.paragraphs(1)
        }
      )
    } else {
      if (i % 5 === 0) {
        data.push(
          {
            id: `Subitem-${1000 + i}`,
            type: Subitem,
            name: faker.lorem.paragraphs(1)
          }
        )
        data.push(
          {
            id: `Subitem-${1000 + i + 1}`,
            type: Subitem,
            name: faker.lorem.paragraphs(1)
          }
        )
        data.push(
          {
            id: `Subitem-${1000 + i + 1}`,
            type: Subitem,
            name: faker.lorem.paragraphs(1)
          }
        )
      } else {
        data.push(
          {
            id: `Item-${1000 + i}`,
            type: Item,
            name: faker.lorem.paragraphs(1)
          }
        )
      }
    }
  }
  return data
}

const newData = (n: number) => {
  const data: any[] = []
  let i = 0
  for (; i < n; i++) {
    data.push(
      {
        id: `NewItem-${1000 + i}`,
        type: Item
      }
    )
    if (i % 5 === 0) {
      data.push(
        {
          id: `Subitem-${1000 + i}`,
          type: Subitem
        }
      )
      data.push(
        {
          id: `Subitem-${1000 + i + 1}`,
          type: Subitem
        }
      )
      data.push(
        {
          id: `Subitem-${1000 + i + 1}`,
          type: Subitem
        }
      )
    }
  }
  return data
}

const fetcher = (i: number) => {
  console.log("fetcher", i);
  const currentAccessToken = sessionStorage.getItem('accessToken');
  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  return fetch(`https://api-dev.dockhealth.app/heydoc-services/task/findListTasksByTaskGroup/73baa05a-a77d-11eb-9858-0e3d2d599b61/7f2c0488-a77d-11eb-9858-0e3d2d599b61?status=INCOMPLETE&startPosition=${30 * i}&endPosition=0`, {
    method: "GET",
    // @ts-ignore
    headers: {
      "Authorization": `Bearer ${currentAccessToken}`,
      "Currentorganizationidentifier": currentOrganizationIdentifier    }
  })
    .then(response => response.json())
}

const fetchSubtasks = (taskIdentifier: string) => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  return fetch(`https://api-dev.dockhealth.app/heydoc-services/task/${taskIdentifier}`, {
    method: "GET",
    // @ts-ignore
    headers: {
      "Authorization": `Bearer ${currentAccessToken}`,
      "Currentorganizationidentifier": currentOrganizationIdentifier
    }
  })
    .then(response => response.json())
}

const invokeUltimateFetcher = (offset: number = 0, limit: number = 10) => {
  console.log("invokeUltimateFetcher", offset, limit);
  const fetches = []
  // for (let i = offset; i <= offset + limit; i++) {
    fetches.push(fetcher(offset))
  // }

  return Promise.all(fetches)
    .then((data) => {
      return data.reduce((accumulator, data) => {
        accumulator.push(...data.taskGroups[0].tasks)
        return accumulator
      }, [])
    })
    .then((tasks) => {
      const ids: string[] = []
      return tasks
        .filter((task: any) => {
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
        .filter((task: any) => task.subTasksCount > 0)
        .map((task: any) => fetchSubtasks(task.identifier))
      return Promise.all(tasksWithSubtasksPromises).then((tasksWithSubtasks) => {
        const tasksWithSubtasksIds = tasksWithSubtasks.map(tasksWithSubtask => tasksWithSubtask.identifier)
        return tasks.map((task: any) => {
          if (tasksWithSubtasksIds.includes(task.identifier)) {
            return tasksWithSubtasks
              .find(tasksWithSubtask => tasksWithSubtask.identifier === task.identifier)
          }
          return task
        })
      })
        .then((tasks) => {
          return tasks.map((task: any) => {
            return convertTask(task);
          })
        })
    })
}

const convertTask = (task: any) => {
  return {
    "id": task.identifier,
    "name": task.description ?? "",
    "details": task.details ?? "",
    "due-date": task.dueDate ?? "",
    "start-date": task.startDate ?? "",
    "creator": task.creator ?? "",
    "children": task.subtasks && task.subtasks.length
      ? task.subtasks.map((subtask: any) => convertTask(subtask))
      : []
  }
}


const superConvert = (data: any[]) => {
  const rows = data.flatMap((d: any) => {
    return [
      {
        type: Item,
        id: d.id,
        name: d.name,
        details: d.details,
        creator: d.creator,
      },
      ...d.children.map((child: any) => {
        return {
          type: Subitem,
          id: d.id,
          name: d.name,
          details: d.details,
          creator: d.creator,
        }
      })
    ]
  })

  return [
    {
      type: List,
      id: "Group1",
      name: faker.lorem.paragraphs(1)
    },
    ...rows,
    {
      id: `ListFooter-`,
      type: ListFooter
    },
    {
      id: `LoadMore-`,
      type: LoadMore
    }
  ]
}

export default function Virtualized() {
  const [items, setItems] = useState([])
  const [offset, setOffset] = useState(0)

  // useEffect(() => {
  //   console.log("offset", offset);
  // }, [offset])

  // @ts-ignore
  const loadMore = useCallback(debounce((item2) => {
    const index = items.findIndex((item: any) => item.id === item2.id)
    invokeUltimateFetcher(offset, offset)
      .then(d => {
        setOffset(offset => offset + 1);
        setItems(items => {
          const newItems = items.slice();
          const rows: any[] = d.flatMap((d: any) => {
              return [
                {
                  type: Item,
                  id: d.id,
                  name: d.name
                },
                ...d.children.map((child: any) => {
                  return {
                    type: Subitem,
                    id: d.id,
                    name: d.name
                  }
                })
              ]
            })
          // @ts-ignore
          newItems.splice(index - 1, 0, ...rows)
          return newItems
        })
      })
  }, 1000), [offset, items])

  // const loadMore = useCallback((item2) => {
  //   const index = items.findIndex(item => item.id === item2.id)
  //   setItems(items => {
  //     const newItems = items.slice();
  //     newItems.splice(index - 1, 0, ...newData(30))
  //     return newItems
  //   })
  // }, [])

  useEffect(() => {
    invokeUltimateFetcher(0, 1)
      .then(d => superConvert(d))
      .then(d => {
        setOffset(offset => offset + 1);
        setItems(d as any);
      })
  }, [])

  return (
    <Virtuoso
      context={{ loadMore }}
      style={{ height: "100%" }}
      data={items}
      // @ts-ignore
      components={{ Item: Segment }}
      itemContent={(index, data) => index}
    />
  )
}

const Segment = React.forwardRef<any, any>((props, ref) => {
  console.log("Segment", props);
  const Component = props.item.type
  return (
    <Component
      ref={ref}
      {...props}
    />
  )
})

const List = React.forwardRef(({ ...props }: any, ref) => (
  <div ref={ref} className={cx.List} {...props}>
    {props.item.name}
  </div>
));

const ListFooter = React.forwardRef(({ children, ...props }: any, ref) => (
  <div ref={ref} className={cx.ListFooter} {...props}>
    <div />
  </div>
));

const Item = React.forwardRef(({ children, ...props }: any, ref) => (
  <div ref={ref} className={cx.Item} {...props}>
    <div>
      {props.item.name} <i>{props.item.details}</i> <b>{props.item.creator?.firstName} {props.item.creator?.lastName}</b>
    </div>
  </div>
));

const LoadMore = React.forwardRef(({ children, ...props }: any, ref) => {
  const { context: { loadMore } } = props
  const handleLoadMore = () => {
    loadMore(props.item)
  }
  return (
    <div ref={ref} className={cx.LoadMore} {...props}>
      <button onClick={handleLoadMore}>
        Load More
      </button>
    </div>
  );
});

const Subitem = React.forwardRef(({ children, ...props }: any, ref) => (
  <div ref={ref} className={cx.Subitem} {...props}>
    <div>
      {props.item.name} <i>{props.item.details}</i> <b>{props.item.creator?.firstName} {props.item.creator?.lastName}</b>
    </div>
  </div>
));