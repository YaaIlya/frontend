import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface FormInputProps {
    name: string;
    control: any;
    label: string;
    type?: string;
}

const FormInput: React.FC<FormInputProps> = ({ name, control, label, type = "text" }) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : null}
                />
            )}
        />
    );
};

export default FormInput;
