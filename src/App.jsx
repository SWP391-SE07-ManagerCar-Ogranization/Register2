import { Box, Button, TextField, MenuItem, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "./Firebase";

const FormInput = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    margin: theme.spacing(2, 0)
}));

const FormContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box"
}));

const ImageUploadButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    alignSelf: "flex-start"
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    alignSelf: "center"
}));

function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [idCard, setIdCard] = useState('');
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');

    const setupRecapcha = () => {
        window.recapchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible',
            defaultCountry: "VN",
        });
    };

    const handleSendOTP = async () => {
        const appVerifier = window.recapchaVerifier;
        await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                alert("Sent OTP successfully");
            })
            .catch((error) => {
                console.log(error);
                alert("Failed to send OTP");
            });
    };

    const handleVerifyOTP = async () => {
        try {
            await window.confirmationResult.confirm(otp);
            alert('Verification successful');
            handleSendUserData();
        } catch (error) {
            console.log(error);
            alert('Failed to verify');
        }
    };

    const handleSendUserData = async () => {
        const userData = {
            name,
            idCard,
            phoneNumber,
            email,
            dob,
            address,
            gender,
            image: image ? await convertImageToBase64(image) : null
        };

        fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(() => {
            console.log("Success:", userData);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    useEffect(() => {
        setupRecapcha();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <FormContainer>
                <Typography variant="h5" component="h1" gutterBottom>
                    Registration Form
                </Typography>
                <FormInput>
                    <TextField
                        variant="outlined"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="ID Card"
                        value={idCard}
                        onChange={(e) => setIdCard(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Gender"
                        select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                    <ImageUploadButton
                        variant="contained"
                        component="label"
                    >
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </ImageUploadButton>
                    <StyledButton variant="contained" onClick={handleSendOTP}>SEND OTP</StyledButton>
                </FormInput>
                <FormInput>
                    <TextField
                        variant="outlined"
                        label="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fullWidth
                    />
                    <StyledButton variant="contained" onClick={handleVerifyOTP}>VERIFY OTP</StyledButton>
                </FormInput>
            </FormContainer>
            <div id="sign-in-button"></div>
        </Box>
    );
}

export default App;
