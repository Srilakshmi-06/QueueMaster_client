import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <CgProfile className='h-8 w-8' color='white' />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <Link to="/profile">
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <Link to="/todo">
                <MenuItem onClick={handleClose}>My To-Do List</MenuItem>
                </Link>
                <Link to="/">
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Link>
            </Menu>
        </div>
    );
}
