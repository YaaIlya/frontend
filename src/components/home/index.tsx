import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Menu, MenuItem, Select, FormControl, Tooltip, AppBar, Toolbar, Typography } from '@mui/material';
import { Person as PersonIcon, QrCode as QRCodeIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import './VirtualCard.css';


const VirtualCard: React.FC = () => {
    const [user, setUser] = useState({
        surname: '',
        firstName: '',
        patronymic: '',
        username: '',
        email: '',
        roles: [] as string[],
    });
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [cardColor, setCardColor] = useState('#ffffff');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8090/api/user/getUserInfo', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setIsAdmin(response.data.roles.includes('ROLE_ADMIN'));
                setIsSuperAdmin(response.data.roles.includes('ROLE_SUPERADMIN'));
        
                const responseForCard = await axios.get('http://localhost:8090/api/virtualCard/getVirtualCard', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const cardData = responseForCard.data;
                const expiryDate = new Date(cardData.expirationDate);
        
                setCard({
                    number: cardData.cardNumber,
                    expiryDate: `${expiryDate.getMonth() + 1}/${expiryDate.getFullYear().toString().slice(-2)}`,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchUserData();
    }, []);

    const fetchCardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const responseForCard = await axios.get('http://localhost:8090/api/virtualCard/getVirtualCard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cardData = responseForCard.data;
            const expiryDate = new Date(cardData.expirationDate);

            setCard({
                number: cardData.cardNumber,
                expiryDate: `${expiryDate.getMonth() + 1}/${expiryDate.getFullYear().toString().slice(-2)}`,
            });
        } catch (error) {
            console.error('Error fetching card data:', error);
        }
    };

    const handleCreateCard = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8090/api/virtualCard/createVirtualCard', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchCardData();
        } catch (error: any) {
            console.log('Error creating or fetching virtual card:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleColorChange = (color: string) => {
        setCardColor(color);
        setEditMode(false);
    };

    const handleNavigateToAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    const handleNavigateToSuperAdminDashboard = () => {
        navigate('/superadmin-dashboard');
    };

    const handleBlockCard = async () => {
        const confirmBlock = window.confirm("Вы уверены, что хотите заморозить карту?");
        if (!confirmBlock) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                'http://localhost:8090/api/virtualCard/blockVirtualCard',
                {
                    description: "Карта заморожена по запросу пользователя"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                alert("Карта успешно заморожена");
                setCard(null);
            }
        } catch (error) {
            console.error('Ошибка при заморозке карты:', error);
            alert("Произошла ошибка при заморозке карты");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <AppBar position="static">
                <Toolbar >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Выйти</Button>
                </Toolbar>
            </AppBar>
        <div className="virtual-card-container">
            <div className="user-info">
                <PersonIcon sx={{ fontSize: 100, color: '#333', marginBottom: 2 }} />
                <QRCodeIcon sx={{ fontSize: 100, color: '#333', marginBottom: 2 }} />
                <div className="user-details">
                    <p>{user.firstName}</p>
                    <p>{user.surname}</p>
                    <p>{user.username}</p>
                    <p>{user.roles.map((role: string) => role.replace('ROLE_', '')).join(', ')}</p>
                    <p>{user.email}</p>
                </div>
            </div>

            <div className="virtual-card" style={{ backgroundColor: cardColor }}>
                <div className="card-content">
                    {card ? (
                        <>
                            <p className="card-number">{card.number}</p>
                            <p className="card-expiry">{card.expiryDate}</p>
                            <p className="card-holder">{user.username}</p>
                        </>
                    ) : (
                        <p>Карта еще не создана</p>
                    )}
                </div>
            </div>

            <div className="icon-container">
                <Tooltip title="Кастомизировать карту" arrow>
                    <IconButton onClick={handleEditClick} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Заморозить карту" arrow>
                    <IconButton onClick={handleBlockCard} aria-label="block">
                        <LockIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {!card && (
                <Button type="submit" variant="contained" onClick={handleCreateCard} sx={{ marginTop: 2, fontFamily: 'Inter' }}>Создать карту</Button>
            )}

            {editMode && (
                <div className="edit-card-container">
                    <FormControl fullWidth>
                        <Select
                            labelId="color-select-label"
                            value={cardColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                        >
                            <MenuItem value="#ffffff">Белый</MenuItem>
                            <MenuItem value="#ff9999">Розовый</MenuItem>
                            <MenuItem value="#99ff99">Зеленый</MenuItem>
                            <MenuItem value="#167ae5">Синий</MenuItem>
                            <MenuItem value="#ffff99">Желтый</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}

            {isAdmin && (
                <Button variant="contained" color="primary" onClick={handleNavigateToAdminDashboard} sx={{ marginTop: 2 }}>
                    Панель управления
                </Button>
            )}

            {isSuperAdmin && (
                <Button variant="contained" color="secondary" onClick={handleNavigateToSuperAdminDashboard} sx={{ marginTop: 2 }}>
                    Панель суперадмина
                </Button>
            )}
        </div>
        </>
    );
};

export default VirtualCard;
