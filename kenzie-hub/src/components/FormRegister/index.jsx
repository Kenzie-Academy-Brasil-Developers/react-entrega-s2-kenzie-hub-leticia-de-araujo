import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";

import { Button, MenuItem } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { StyledPaper, StyledForm, StyledTextField, theme } from "./style";
import api from "../../services/api";
import { useState } from "react";

const FormRegister = () => {
  const history = useHistory();

  const [module, setModule] = useState(
    "First module (Introduction to Frontend)"
  );

  const handleChange = (event) => {
    console.log(event.target.value);
    setModule(event.target.value);
  };

  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup.string().required("Email is required.").email("Invalid email."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must have at least 6 characters."),
    confirmPassword: yup
      .string()
      .required("You need to confirm your passsword.")
      .oneOf([yup.ref("password")], "Password didn't match."),
    bio: yup.string().required("Bio is required."),
    contact: yup.string().required("Contact is required"),
    course_module: yup.string().required("Please select your module"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const clearInputs = (event) => {
    const inputs = [...event.target.elements];
    console.log(inputs);
    inputs.forEach((input) => {
      input.value = "";
    });
  };

  const onSubmitFunction = (dataUser, event) => {
    const dataFixedArray = Object.entries(dataUser).filter(
      (entrie) => entrie[0] !== "confirmPassword"
    );
    console.log(dataFixedArray);

    let dataObject = {};

    dataFixedArray.forEach((entrie) => {
      let key = entrie[0];
      let value = entrie[1];
      dataObject[key] = value;
    });

    console.log(dataObject);

    api
      .post("/users", dataObject, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        const idUser = response.data.id;
        clearInputs(event);
        history.push(`/home/${idUser}`);
      })
      .catch((error) => {
        console.log(error);
        clearInputs(event);
      });
  };

  const modules = [
    {
      value: "First module (Introduction to Frontend)",
      label: "First module",
    },
    {
      value: "Second module (Advanced front-end)",
      label: "Second module",
    },
    {
      value: "Third module (Introduction to Backend)",
      label: "Third module",
    },
    {
      value: "Fourth module (Advanced Backend)",
      label: "Fourth module",
    },
  ];

  return (
    <StyledPaper elevation={3}>
      <div className="FormRegister-header">
        <h2>Create an account</h2>
        <span>It's fast and free.</span>
      </div>

      <StyledForm onSubmit={handleSubmit(onSubmitFunction)}>
        <ThemeProvider theme={theme}>
          <label>
            Name
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Your full name"
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : null}
            />
          </label>
          <label>
            Email
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Your email"
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : null}
            />
          </label>
          <label>
            Password
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Your password"
              type="password"
              {...register("password")}
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : null}
            />
          </label>
          <label>
            Confirm password
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Confirm your password"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword ? true : false}
              helperText={
                errors.confirmPassword ? errors.confirmPassword.message : null
              }
            />
          </label>
          <label>
            Bio
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Tell us a little about yourself"
              {...register("bio")}
              error={errors.bio ? true : false}
              helperText={errors.bio ? errors.bio.message : null}
            />
          </label>
          <label>
            Contact
            <StyledTextField
              variant="outlined"
              size="small"
              color="secondary"
              placeholder="Your phone number or your Linkedin url"
              {...register("contact")}
              error={errors.contact ? true : false}
              helperText={errors.contact ? errors.contact.message : null}
            />
          </label>
          <label>
            Select module
            <StyledTextField
              id="outlined-select-module"
              size="small"
              color="secondary"
              {...register("course_module")}
              select
              value={module}
              onChange={handleChange}
              //   error={errors.course_module ? true : false}
              //   helperText={
              //     errors.course_module ? errors.course_module.message : null
              //   }
            >
              {modules.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          </label>

          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "capitalize", width: "100%" }}
            type="submit"
          >
            Create your account
          </Button>
        </ThemeProvider>
      </StyledForm>
    </StyledPaper>
  );
};

export default FormRegister;
