import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "../../common/user.model";
import showAlert from "../../utils/alerts";
import './css/register.css';

export function Register(props: { user: User }): React.ReactElement {
  const [userType, setUserType] = useState('');
  const typeEv = (e: any) => {
    setUserType(e.target.value);
  }
  let navigate = useNavigate();

  useEffect(() => {
    if (props.user.uuid !== '') {
      navigate('/dashboard')
    }
  }, [navigate, props]);

  const { register, formState: { errors }, handleSubmit } = useForm();

  return (
    <div className="wrapper m-auto">
      <label id="register-label" className="active" htmlFor="register-form"> Registro </label>
      <form id="register-form" onSubmit={
        handleSubmit((dat, e) => {
          if (e) e.preventDefault();
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: dat.username,
              lastname: dat.userLastName,
              password: dat.password,
              type: dat.userType
            })
          };
          fetch('http://localhost:3333/auth/signup', requestOptions).then((res) => {
            res.json().then(async (e) => {
              if (e.error) {
                await showAlert({
                  type: "err",
                  msg: e.message,
                });
              } else {
                await showAlert({
                  type: "ok",
                  msg: 'Registrado',
                });
                navigate("/login");
              }
            }).catch(async (e) => {
              console.log(e);
              await showAlert({ type: 'err', msg: 'Error en el servidor al crear usuario' });
            })
          }).catch(async (e) => {
            console.log(e);
            await showAlert({ type: 'err', msg: 'Error en la conexion con el servidor' });
          });
        })}>
        <div className='form-container'>
          <div className="form-group">
            <input className='form-control' id='u_name' type="text" placeholder="Nombre" autoComplete="username"
              {...register("username", { required: true, minLength: 5, maxLength: 15, pattern: /^[A-z]+$/ })} />
            {errors.username?.type === "required" && <p className='no-valid'>Debes escribir un nombre</p>}
            {errors.username?.type === "minLength" && <p className='no-valid'>El nombre debe tener al menos 5 caracteres</p>}
            {errors.username?.type === "maxLength" && <p className='no-valid'>El nombre es muy grande</p>}
            {errors.username?.type === "pattern" && <p className='no-valid'>El nombre solo debe contener letras</p>}
          </div>

          <div className="form-group">
            <input className='form-control' id='u_lastname' type="text" placeholder="Apellidos" autoComplete="username"
              {...register("userLastName", { required: true, minLength: 5, maxLength: 30, pattern: /^[A-z ]+$/ })} />
            {errors.userLastName?.type === "required" && <p className='no-valid'>Debes escribir tu apellido</p>}
            {errors.userLastName?.type === "pattern" && <p className='no-valid'>El apellido solo debe contener letras</p>}
            {errors.userLastName?.type === "maxLength" && <p className='no-valid'>El apellido es muy grande</p>}
            {errors.userLastName?.type === "minLength" && <p className='no-valid'>El nombre debe tener al menos 5 caracteres</p>}

          </div>

          <div className="form-group">
            <input className="form-control" id="u_pass" type="password" placeholder="Contraseña" autoComplete="current-password"
              {...register("password", { required: true, pattern: /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/, minLength: 8 })} />
            {errors.password?.type === "required" && <p className='no-valid'>Debes escribir una contraseña</p>}
            {errors.password?.type === "minLength" && <p className='no-valid'>La contraseña debe tener al menos 8 caracteres</p>}
            {errors.password?.type === "pattern" && <p className='no-valid'>Su contraseña debe contener mayuscula y minusculas, 1 digito y 1 caracter especial</p>}
          </div>

          <div className="form-group">
            <select id="select" className="form-select user-type-select"
              {...register("userType", { required: true, onChange: typeEv })}>
              <option value="">Selecciona un tipo de usuario</option>
              <option value="Doctor">Doctor</option>
              <option value="Paciente">Paciente</option>
            </select>
            {errors.userType?.type === "required" && <p className="no-valid">Debe seleccionar un tipo de usuario</p>}
          </div>

        </div>
        <div className="buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" id="btn-cancel" type="button">Cancelar</button>
          <button className="btn btn-success" id="btn-register" type="submit">Crear</button>
        </div>
      </form>
    </div>
  );
}
