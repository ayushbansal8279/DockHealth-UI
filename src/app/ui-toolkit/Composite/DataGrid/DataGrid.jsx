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

const proxy = new Proxy(
  { __EMPTY__: null },
  {
    get() {
      return proxy;
    },
  },
);

/**
 * A component for displaying dataset in form of a Grid.
 *
 * @param controller? {any}            - is an object containing an imperative API to manipulate state of the component.
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
 *      { firstName: "Laramy", lastName: "Fisk", age: 28 },
 *      { firstName: "Gabriel", lastName: "Santiago", age: 42 },
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
  controller = proxy,
  fluid = false,
  multiselect = false,
  dataset = [],
  onRecordClick = noop,
  children,
  ...props
}) {
  const [definitions, setDefinitions] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const register = useCallback(
    (data) => {
      if (!definitions.some((header) => header.name === data.name)) {
        setDefinitions((currentValue) => [...currentValue, data]);
      }
    },
    [definitions],
  );

  useEffect(() => {
    register({
      field: 'id',
      name: 'Identifier',
      hidden: true,
      value: ({ identifier }) => identifier,
    });
  }, [register, dataset]);

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
        ({ field, type, name, unsortable, editable, renderCell }) => ({
          type,
          field,
          headerName: name,
          sortable: !unsortable,
          editable,
          renderCell,
          flex: fluid ? 1 : undefined,
        }),
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
        apiRef={controller.ref}
        columns={columns}
        rows={rows}
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
      <Context.Provider value={{ register }}>{children}</Context.Provider>
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

/*

  const ? = [
    {

    }
  ]


  const dataset = [
    {
        "patientId": 3186,
        "patientIdentifier": "ca640e89-30f3-474b-b96d-015b3d0d448b",
        "firstName": "Wanda",
        "lastName": "Four",
        "phoneHome": "",
        "patientName": "Four, Wanda"
    }
  ]

  <DataGrid
    multiselect
    dataset={}
  >
    <Data
      type="string"
      name="PATIENT"
      enable={{ sticky, sortable, draggable }}
      render={({ firstName, lastName }) =>
        `{firstName} {lastName}`
      }
    />
  </ DataGrid>


 */
