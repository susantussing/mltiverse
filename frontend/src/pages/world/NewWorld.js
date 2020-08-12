import React from 'react';
import SidebarLayout from 'layouts/Sidebar';
import WorldForm from 'components/WorldForm';
import { useAuth } from 'contexts/auth';
import WorldSidebar from './WorldSidebar';

function NewWorld() {
  const [{ userId }] = useAuth();

  return (
    <SidebarLayout title="New World" Sidebar={WorldSidebar}>
      <WorldForm initialValues={{ user: userId }} />
    </SidebarLayout>
  );
}

export default NewWorld;
