import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUserRole } from './axios';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                if (Array.isArray(usersData)) {
                    const enrichedUsers = usersData.map((user: any) => {
                        // Get the first card if it exists
                        const firstCard = user.virtualCard.length > 0 ? user.virtualCard[0] : null;
                        return {
                            userId: user.id,
                            username: user.username,
                            roles: user.roles.map((roleObj: any) => roleObj.role.split('_')[1] || roleObj.role),
                            cardNumber: firstCard ? firstCard.id : 'Нет карты',
                        };
                    });
                    setUsers(enrichedUsers);
                } else {
                    console.error('Expected an array but got:', usersData);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        loadUsers();
    }, []);
    
    
    
    

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
        setStatus(user.roles[0] || '');
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleChangeStatus = async () => {
        if (selectedUser) {
            try {
                await updateUserRole(selectedUser.userId, status);
                setUsers(users.map(user => user.userId === selectedUser.userId ? { ...user, roles: [status] } : user));
                handleCloseMenu();
            } catch (error) {
                console.error('Error updating user status:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleProfileRedirect = () => {
        navigate('/home');
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Панель управления Администратора T1
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Выйти</Button>
                    <Button color="inherit" onClick={handleProfileRedirect}>Профиль</Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Box mt={4}>
                    <Grid container spacing={3}>
                        {users.map(user => (
                            <Grid item xs={12} sm={6} md={4} key={user.userId}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">{user.username}</Typography>
                                        <Typography color="textSecondary">Номер карты: {user.cardNumber}</Typography>
                                        <Typography color="textSecondary">Роли: {user.roles.join(', ')}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton onClick={(event) => handleOpenMenu(event, user)}>
                                            <PersonIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Статус</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Роль"
                            >
                                <MenuItem value="VIP">VIP</MenuItem>
                                <MenuItem value="UPGRADED">UPGRADED</MenuItem>
                                <MenuItem value="CANSLE VIP">CANSLE VIP</MenuItem>
                                <MenuItem value="CANSLE UPGRADED">CANSLE UPGRADED</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                    <MenuItem>
                        <Button variant="contained" onClick={handleChangeStatus} sx={{ marginTop: 2 }}>
                            Изменить статус
                        </Button>
                    </MenuItem>
                </Menu>
            </Container>
        </div>
    );
};

export default AdminDashboard;