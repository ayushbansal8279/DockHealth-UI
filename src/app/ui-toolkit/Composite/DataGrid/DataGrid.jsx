import React, { createContext, useEffect, useMemo, useState } from 'react';
import * as MUI from '@mui/x-data-grid';
import { noop } from 'ui-toolkit/utilities';
import * as Sc from './styled';

export const Context  = createContext({
  register: noop
})

const MemoizedRow = React.memo(MUI.GridRow);

/**
 *
 * @param multiselect
 * @param dataset
 * @param children
 * @param onRecordClick
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function DataGrid({
  multiselect = false,
  dataset = [],
  children,
  onRecordClick = noop,
  ...props
}) {
  const [definitions, setDefinitions] = useState([]);

  const register = (data) => {
    if (!definitions.some(header => header.name === data.name)) {
      setDefinitions(currentValue => [...currentValue, data]);
    }
  };

  const columns = useMemo(() =>
    definitions
      .map(({ field, type, name, unsortable, editable }) => ({
        type: type,
        field: field,
        headerName: name,
        sortable: !unsortable,
        editable: editable,
        flex: 1
      })),
    [definitions]
  );

  const rows = useMemo(() => {
    if (definitions.length > 0) {
      return dataset
        .map(data =>
          Object.fromEntries(
            definitions.map(definition =>
              [definition.field, definition.value(data)])
          ))
    } else {
      return [];
    }
  }, [definitions, dataset]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setColumnVisibilityModel(
      Object.fromEntries(
        definitions.map(({ field, hidden }) => [field, !hidden])
      )
    );
  }, [definitions]);

  const handleRowClick = (rowInstance, event) => {
    const { row } = rowInstance;
    onRecordClick(event, row);
  };

  return (
    <div style={{
      padding: "30px",
      height: "100%"
    }}>
      <Sc.DataGrid
        columns={columns}
        rows={rows}
        components={{
          Row: MemoizedRow
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        disableRowSelectionOnClick
        checkboxSelection={multiselect}
        onRowClick={handleRowClick}
        {...props}
      />
      <Context.Provider value={{ register }}>
        {children}
      </Context.Provider>
    </div>
  );
}



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