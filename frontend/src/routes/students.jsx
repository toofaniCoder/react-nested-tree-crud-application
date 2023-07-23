import { useState } from 'react';
import { Sheet, Table, Avatar, Stack, Button, IconButton } from '@mui/joy';
import { Outlet, useLoaderData } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { Link } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('profile', {
    id: 'profile',
    header: ({ table }) => (
      <Stack alignItems={'center'} direction="row" spacing={2}>
        <Button
          onClick={table.getToggleAllRowsExpandedHandler()}
          color="warning"
          size="sm"
          style={{ fontSize: 16 }}
        >
          {table.getIsAllRowsExpanded() ? '👇' : '👉'}
        </Button>
        <span>Profile Picture</span>
      </Stack>
    ),
    cell: ({ row, getValue }) => (
      <Stack
        sx={{ paddingLeft: `${row.depth * 2}rem` }}
        direction="row"
        spacing={2}
      >
        {row.getCanExpand() ? (
          <Button
            onClick={row.getToggleExpandedHandler()}
            color="warning"
            size="sm"
            style={{ fontSize: 16 }}
          >
            {row.getIsExpanded() ? '👇' : '👉'}
          </Button>
        ) : (
          <Button
            size="sm"
            disabled
            color="neutral"
            sx={{ filter: 'grayscale(1)' }}
          >
            🔵
          </Button>
        )}
        <Avatar src={`${axios.defaults.baseURL}/${getValue()}`} />
      </Stack>
    ),
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Full Name',
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'E-mail Address',
  }),
  columnHelper.accessor('phone', {
    id: 'phone',
    header: 'Phone Number',
  }),
  columnHelper.accessor('action', {
    id: 'action',
    header: <p style={{ textAlign: 'center' }}>Actions</p>,
    cell: ({ row }) => (
      <Stack justifyContent={'center'} direction={'row'} spacing={1}>
        <IconButton component={Link} to={`${row.original._id}/create`}>
          <AddIcon />
        </IconButton>
        <IconButton
          component={Link}
          to={`${row.original._id}/edit`}
          color="success"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          component={Link}
          to={`${row.original._id}/delete`}
          color="danger"
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
  }),
];

const Students = () => {
  const [expanded, setExpanded] = useState({});
  const data = useLoaderData();
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    getSubRows: (row) => row.subRows,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  // console.log(data);
  return (
    <>
      <Outlet />
      <Button component={Link} to="create" sx={{ mb: 2 }}>
        Create Student
      </Button>
      <Sheet sx={{ borderRadius: 10 }}>
        <Table size="lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <th key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
};

export default Students;
