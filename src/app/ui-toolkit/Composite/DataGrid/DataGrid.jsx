import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as MUI from '@mui/x-data-grid';
import { noop } from 'ui-toolkit/utilities';
import * as Sc from './styled';

export const Context = createContext({
  register: noop,
});

const MemoizedRow = React.memo(MUI.GridRow);

const CustomColumnMenu = ({ ...props }) => {
  return (
    <MUI.GridColumnMenu
      {...props}
      slots={{
        columnMenuColumnsItem: null,
        columnMenuFilterItem: null,
      }}
    />
  );
};

/**
 * A component for displaying dataset in form of a Grid.
 *
 * @param controller? {any}           - is an object containing an imperative API to manipulate state of the component.
 * @param fluid {boolean}             - is a flag whether columns should expand to their maximum width or not.
 * @param multiselect {boolean}       - is a flag whether row should support multiselect or not.
 * @param dataset {{}[]}              - is a dataset to display.
 * @param onRecordClick {() => void}  - is a callback reacting to clicking on a single record.
 * @param children {JSX.Element}
 * @param props {any}
 * @returns {JSX.Element}
 * @constructor
 *
 * @example
 * ```
 *    const controller = useController()
 *
 *    <DataGrid controller={controller} dataset={[
 *      { firstName: "First1", lastName: "Last1", age: 28 },
 *      { firstName: "First2", lastName: "Last2", age: 42 },
 *    ]}>
 *      <Data
 *        name="Name"
 *        value={data => data.firstName + data.lastName}
 *      />
 *      <Data
 *        name="Age"
 *        value={data => data.age}
 *      />
 *    </DataGrid>
 * ```
 */
export default function DataGrid({
  controller,
  fluid = false,
  multiselect = false,
  dataset = [],
  onRecordClick = noop,
  children,
  ...props
}) {
  const [definitions, setDefinitions] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const register = useCallback((definition) => {
    setDefinitions((currentValue) => {
      if (!currentValue.some(({ field }) => field === definition.field)) {
        return [...currentValue, definition];
      }
      return currentValue;
    });
  }, []);

  const unregister = useCallback((field) => {
    setDefinitions((currentValue) => {
      const found = currentValue.find(
        (definition) => definition.field === field,
      );
      if (found) {
        return currentValue.filter((definition) => definition !== found);
      }
      return currentValue;
    });
  }, []);

  useEffect(() => {
    if (!definitions.some(({ field }) => field === 'id')) {
      register({
        field: 'id',
        name: 'Identifier',
        hidden: true,
        value: ({ identifier }) => identifier,
      });
    }
  }, [dataset, definitions, register]);

  const rows = useMemo(() => {
    if (definitions.length > 0) {
      return dataset.map((data) =>
        Object.fromEntries(
          definitions.map((definition) => [
            definition.field,
            definition.value(data),
          ]),
        ),
      );
    }
    return [];
  }, [definitions, dataset]);

  const columns = useMemo(
    () =>
      definitions.map(
        ({ field, type, name, unsortable, editable, flex, renderCell, headerRenderer }) => {
          const optional = {};
          if (fluid) {
            optional.flex = flex ?? 1;
          }
          return {
            type,
            field,
            headerName: name,
            sortable: !unsortable,
            editable,
            renderCell,
            renderHeader: headerRenderer,
            ...optional,
          };
        },
      ),
    [definitions, fluid],
  );

  useEffect(() => {
    setColumnVisibilityModel(
      Object.fromEntries(
        definitions.map(({ field, hidden }) => [field, !hidden]),
      ),
    );
  }, [definitions]);

  const handleRowClick = (rowInstance, event) => {
    const { row } = rowInstance;
    onRecordClick(event, row);
  };

  return (
    <div
      style={{
        padding: '30px',
        height: '100%',
      }}
    >
      <Sc.DataGrid
        apiRef={controller ? controller.ref : null}
        columns={columns}
        rows={rows}
        slots={{ columnMenu: CustomColumnMenu }}
        components={{
          Row: MemoizedRow,
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        disableRowSelectionOnClick
        checkboxSelection={multiselect}
        onRowClick={handleRowClick}
        {...props}
      />
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <Context.Provider value={{ register, unregister }}>
        {children}
      </Context.Provider>
    </div>
  );
}

export const useController = () => {
  const apiReference = MUI.useGridApiRef();
  return {
    column: (field) => {
      return {
        get visibility() {
          return apiReference.current
            .getVisibleColumns()
            .some((column) => column.field === field);
        },
        set visibility(value) {
          apiReference.current.setColumnVisibility(field, value);
        },
      };
    },
    ref: apiReference,
  };
};
