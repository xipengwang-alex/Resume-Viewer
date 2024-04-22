import React from 'react';
import { Outlet } from 'react-router-dom';

const BasicLayout = () => (
    <div className="App">
      <div className="content">
        <Outlet /> {/* This will render the child route components */}
      </div>
    </div>
  );
  
  export default BasicLayout;