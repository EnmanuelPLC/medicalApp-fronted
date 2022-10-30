import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "../../common/user.model";
import showAlert from "../../utils/alerts";
import './css/login.css';

export function Login(props:{ onSignIn: Function, user: User }): React.ReactElement {
  let navigate = useNavigate();

  useEffect(() => {
    if (props.user.uuid !== '') {
      navigate('/dashboard')
    }
  }, [navigate, props]);

  const { register, formState: { errors }, handleSubmit } = useForm();

  return (
    <div className="wrapper m-auto">
      <label id="auth-label" className="active" htmlFor="formularios"> Autenticación </label>
      <form id='auth-form' onSubmit={
        handleSubmit(async (dat, e) => {
          if (e) e.preventDefault();
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: dat.username,
              pass: dat.password
            })
          };
          await fetch(`http://localhost:3333/auth/signin`, requestOptions).then(async (res) => {
            await res.json().then(async (e) => {
              if (e.error) {
                await showAlert({
                  type: "err",
                  msg: e.message,
                });
              } else {
                if (e.login) {
                  await showAlert({
                    type: "ok",
                    msg: 'Autenticado',
                  });
                  localStorage.setItem("uuid", JSON.stringify(e.user.uuid));
                  localStorage.setItem("name", JSON.stringify(e.user.name));
                  localStorage.setItem("type", JSON.stringify(e.user.type));
                  props.onSignIn({uuid: e.user.uuid, name: e.user.name, type: e.user.type});
                  navigate("/dashboard");
                } else {
                  await showAlert({
                    type: "war",
                    msg: e.msg,
                  });
                }
              }
            });
          }).catch(async (e) => {
            // await showAlert({
            //   type: "err",
            //   msg: e.msg,
            // });
          });
        })}>
        <div className='form-container'>
          <div className="frm1 form-group">
            <input className='form-control' id='login-user' type="text" placeholder="Username" autoComplete="username"
              {...register("username", { required: true, minLength: 5, maxLength: 15 })} />
            {errors.username?.type === "required" && <p className='no-valid'>Debes escribir un nombre</p>}
            {errors.username?.type === "minLength" && <p className='no-valid'>El nombre debe tener al menos 5 caracteres</p>}
            {errors.username?.type === "maxLength" && <p className='no-valid'>El nombre es muy grande</p>}
          </div>

          <div className="frm2 form-group">
            <input className="form-control" id="login-pass" type="password" placeholder="Password" autoComplete="current-password"
              {...register("password", { required: true, pattern: /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/, minLength: 8 })} />
            {errors.password?.type === "required" && <p className='no-valid'>Debes escribir una contraseña</p>}
            {errors.password?.type === "minLength" && <p className='no-valid'>La contraseña debe tener al menos 8 caracteres</p>}
            {errors.password?.type === "pattern" && <p className='no-valid'>Su contraseña debe contener mayuscula y minusculas, 1 digito y 1 caracter especial</p>}
          </div>
        </div>
        <button className="btn btn-success w-100" id="btn-login" type="submit">Iniciar Sesion</button>
      </form>
    </div>
  );
}
