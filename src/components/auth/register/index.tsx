import React, { useState } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, Checkbox, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IPropsRegister } from '../../common/types/auth';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
    const { setPassword, setEmail, setRepeatPassword, setFirstName, setLastName, setUserName, setGender, setBirthDate, setPatronymic } = props;
    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(event.target.checked);
    };

    const handlePolicyClick = () => {
        // Замени URL на путь к вашему файлу с политикой
        window.open(process.env.PUBLIC_URL + '/personal-data-processing-policy-TS-Integration.pdf', '_blank');
    };

    return (
        <div>
            <Typography variant="h4" fontFamily='Inter' textAlign='left' marginBottom={3}>Регистрация</Typography>
            <TextField fullWidth={true} margin='normal' label="Имя" variant="outlined" placeholder='Введите ваше имя' onChange={(e) => setFirstName(e.target.value)} />
            <TextField fullWidth={true} margin='normal' label="Фамилия" variant="outlined" placeholder='Введите вашу фамилию' onChange={(e) => setLastName(e.target.value)} />
            <TextField fullWidth={true} margin='normal' label="Отчество" variant="outlined" placeholder='Введите ваше отчество' onChange={(e) => setPatronymic(e.target.value)} />
            <TextField
                id="date"
                label="Дата рождения"
                margin='normal'
                type="date"
                defaultValue="2003-05-24"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => setBirthDate(e.target.value)}
            />
            <FormControl sx={{ marginLeft: '350px' }}>
                <FormLabel id="gender-label" >Пол</FormLabel>
                <RadioGroup
                    aria-labelledby="gender-label"
                    defaultValue="Мужской"
                    name="gender"
                    onChange={(e) => setGender(e.target.value)}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Женский" />
                    <FormControlLabel value="male" control={<Radio />} label="Мужской" />
                </RadioGroup>
            </FormControl>
            <TextField fullWidth={true} margin='normal' label="Username" variant="outlined" placeholder='Введите ваш Username' onChange={(e) => setUserName(e.target.value)} />
            <TextField fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите ваш Email' onChange={(e) => setEmail(e.target.value)} />
            <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите ваш пароль' onChange={(e) => setPassword(e.target.value)} />
            <TextField type='password' fullWidth={true} margin='normal' label="Повторите ваш пароль" variant="outlined" placeholder='Повторите ваш пароль' onChange={(e) => setRepeatPassword(e.target.value)} />
            
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isAgreed}
                        onChange={handleCheckboxChange}
                    />
                }
                label={
                    <Typography variant="body2" fontFamily='Inter'>
                        Я соглашаюсь с 
                        <Link component="button" variant="body2" onClick={handlePolicyClick} sx={{ ml: 0.5 }}>
                            политикой в отношении персональных данных
                        </Link>
                    </Typography>
                }
            />

            <Button
                type='submit'
                fullWidth={true}
                variant="contained"
                sx={{ marginTop: 2, fontFamily: 'Inter' }}
                disabled={!isAgreed}
            >
                Регистрация
            </Button>

            {!isAgreed && (
                <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
                    Для регистрации необходимо согласие на обработку персональных данных
                </Typography>
            )}

            <Typography variant="body1" sx={{ fontFamily: 'Inter', textAlign: 'center', marginTop: 3 }}>
                У вас есть аккаунт? <span onClick={handleLoginClick} className='incitingText'>Авторизация</span>
            </Typography>
        </div>
    );
};

export default RegisterPage;
