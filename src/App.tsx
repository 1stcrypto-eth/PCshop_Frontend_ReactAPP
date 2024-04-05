import * as React from "react";
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";

import { useFetchStoreQuery, useUpdateRowMutation } from "./services/storeApi";
import { Container, TextField } from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";

export default function FullFeaturedCrudGrid() {
  // Colume Defination
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, editable: false },
    {
      field: "memory",
      headerName: "Memory",
      type: "string",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "storage",
      headerName: "Storage",
      type: "string",
      editable: false,
    },
    {
      field: "port",
      headerName: "USB Port",
      editable: false,
      type: "string",
      width: 200,
    },
    {
      field: "render",
      headerName: "Render",
      editable: true,
      type: "string",
      width: 200,
    },
    {
      field: "weight",
      headerName: "Weight",
      editable: false,
      type: "string",
    },
    {
      field: "psu",
      headerName: "Power Supply Unit",
      editable: false,
      type: "string",
      width: 180,
    },
    {
      field: "processor",
      headerName: "Processor",
      editable: true,
      type: "string",
      width: 200,
    },
  ];

  // States
  const [dataRows, setDataRows] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });
  


  // Hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [updateRow] = useUpdateRowMutation();
  const { data, isLoading } = useFetchStoreQuery({
    page: paginationModel.page,
    limit: paginationModel.pageSize,
    keyword: debouncedSearchTerm || ''
  });

  // Page initialize due for new search
  React.useEffect(() => {setPaginationModel(prev => ({page:0, pageSize:prev.pageSize}))}, [debouncedSearchTerm]);

  // Update Row
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log("params, event", newRow);
    updateRow(newRow);
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  // Handle page size
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  return (
    <Container
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <h2 style={{ textAlign: "center" }}>PC STORE</h2>
      <div style={{width: "100%", display: "flex"}}>
        <TextField id="outlined-basic" label="Search" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{marginBottom: "12px", marginLeft: "auto"}} />
      </div>
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'dark.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'dark.main',
          },
        }}
        rows={data?.data?.map((item:any) => item?.value) || []}
        columns={columns}
        editMode="row"
        paginationMode="server"
        rowCount={data?.totalSize || 0}
        loading={isLoading}
        rowModesModel={rowModesModel}
        pageSizeOptions={[5,10,25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
      />
    </Container>
  );
}
