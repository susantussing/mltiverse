import React from 'react';
import SidebarLayout from 'layouts/Sidebar';
import WorldForm from 'components/WorldForm';

function NewWorld() {
  return (
    <SidebarLayout title="New World">
      <WorldForm />
    </SidebarLayout>
  );
}

export default NewWorld;
