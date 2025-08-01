import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarConLocation = () => {
  const location = useLocation();
  return <Navbar location={location} />;
};

export default NavbarConLocation;