import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../common/user.model";
import { FaPowerOff } from "react-icons/fa";
import showAlert from "../../utils/alerts";
import './dashboard.css';
import { MyModal } from "../modal/modal";
import { useForm } from "react-hook-form";

export function Dashboard(props: { user: User, onSignOut: Function }): React.ReactElement {
  const [dbRecipes, setDbRecipes] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [selectedPacient, setSelectedPacient] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState(Object);
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, reset: reset2 } = useForm();
  const [show, setShow] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [update, setUpdate] = useState(0);

  const handleClose = () => {
    setShow(false);
    reset();
  }

  const handleShow = () => setShow(true);

  const handleShowView = (e: any) => {
    setShowView(true);
    let res = dbRecipes.filter((recipe: any) => recipe.id === Number(e.target.value));
    setCurrentRecipe(res[0]);
  }

  const handleCloseView = () => {
    setShowView(false);
  }
  const handleShowEdit = (e: any) => {
    setShowEdit(true);
    let res = dbRecipes.filter((recipe: any) => recipe.id === Number(e.target.value));
    setCurrentRecipe(res[0]);
  }

  const handleCloseEdit = () => {
    setShowEdit(false);
    reset2();
  }

  const selectPacient = (e: any) => {
    setSelectedPacient(e.target.value)
  }

  const navigate = useNavigate();

  const delRecipe = (e: any) => {
    if (!window.confirm(`Seguro que quieres eliminar esta receta?`)) return;
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`http://localhost:3333/recipes/${e.target.value}`, requestOptions).then((res) => {
      res.json().then(async (e) => {
        if (e.error) {
          await showAlert({ type: 'err', msg: e.message });
        } else {
          await showAlert({ type: 'ok', msg: 'Receta borrada' });
          setUpdate(update + 1);
        }
      })
    }).catch(async (e) => {
      console.log(e);
      await showAlert({ type: 'err', msg: 'Error al conectar con el servidor' });
    });
  }

  useEffect(() => {
    if (props.user.uuid === '') {
      navigate('/login')
    }
    fetch('http://localhost:3333/recipes').then((e) => {
      e.json().then((e) => {
        setDbRecipes(e);
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });

    fetch('http://localhost:3333/user').then((e) => {
      e.json().then((e) => {
        setDbUsers(e);
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
  }, [navigate, props, update]);

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="user-area">
          <div className="welcome">
            <h2>Bienvenido {props.user.type} {props.user.name}</h2>
          </div>
          <div className="actions">
            <button onClick={async (e) => {
              if (!window.confirm(`Seguro deseas salir?`)) return;
              await showAlert({ type: 'inf', msg: 'Usted ha cerrado sesion, hasta pronto' });
              props.onSignOut(e);
            }} className="btn btn-outline-danger logOut">Cerrar sesión <FaPowerOff /></button>
          </div>
        </div>

        <div className="work-area">
          {props.user.type === 'Doctor' ? (
            <>
              <div className="recipes-container" style={{height: '80%'}}>
                {dbRecipes.length > 0 ? (
                  dbRecipes.map((dbItem: any, index) => (
                    dbItem.doctor.id === props.user.uuid ? (
                      <div className='recipe-item' key={index}>
                        <p>Receta <code># {dbItem.id}</code> para paciente {dbItem.pacient.name}</p>
                        <div className="recipe-actions">
                          <button className="btn btn-outline-success" type="button" value={dbItem.id} onClick = { handleShowView }>Ver</button>
                          <button className="btn btn-outline-info" type="button" value={dbItem.id} onClick={handleShowEdit}>Editar</button>
                          <button className="btn btn-outline-danger" type="button" value={dbItem.id} onClick={(e) => { delRecipe(e)}}>Eliminar</button>
                        </div>
                        <div className="date">{dbItem.date}</div>
                      </div>
                    ) : ('')
                  ))
                ) : (
                  <div className="empty-recipes">No hay recetas</div>
                )}
              </div>
              <div className="create-recipe">
                <button type="button" className="btn btn-success w-25" onClick={handleShow}>Crear receta</button>
              </div>
            </>
          ): (
              <div className="recipes-container" style={{ height: '80%' }}>
                {dbRecipes.length > 0 ? (
                  dbRecipes.map((dbItem: any, index) => (
                    dbItem.pacient.id === props.user.uuid ? (
                      <div className='recipe-item' key={index}>
                        <p>Receta <code># {dbItem.id}</code> del doctor {dbItem.doctor.name}</p>
                        <div className="recipe-actions">
                          <button className="btn btn-outline-success" type="button" value={dbItem.id} onClick={handleShowView}>Ver</button>
                        </div>
                      </div>
                    ) : ('')
                  ))
                ) : (
                  <div className="empty-recipes">No hay recetas</div>
                )}
              </div>
          )}
        </div>
      </div>

      <MyModal title="Crear Receta" show={show} hndClose={handleClose} hndShow={handleShow}>
        <form className="modal-form" onSubmit={
          handleSubmit((dat, e) => {
            if (e) e.preventDefault();
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                doctor: props.user.uuid,
                pacient: selectedPacient,
                medicine: dat.medicine,
                useDescription: dat.recipeUse,
              })
            };
            fetch('http://localhost:3333/recipes/create', requestOptions).then((res) => {
              res.json().then(async (e) => {
                if (e.error) {
                  await showAlert({ type: 'err', msg: e.message });
                } else {
                  await showAlert({ type: 'ok', msg: 'Receta creada' });
                  handleClose();
                  setUpdate(update + 1);
                }
              }).catch(async (e) => {
                console.log(e);
              })
            }).catch(async (e) => {
              console.log(e);
              await showAlert({ type: 'err', msg: 'Error en la conexion con el servidor' });
            });
          })}>
          <div className='form-container'>
            <div className="form-group">
              <input className='form-control' id='recipe-medicine' type="text" placeholder="Medicina"
              {...register("medicine", { required: true })} />
              {errors.medicine?.type === "required" && <p className='no-valid'>Debes escribir un medicamento</p>}
            </div>

            <div className="form-group">
              <input className='form-control' id='recipe-useDescription' type="text" placeholder="Descripción de uso"
                {...register("recipeUse", { required: true, minLength: 10 })} />
              {errors.recipeUse?.type === "required" && <p className='no-valid'>Escribe la forma de usar el medicamento</p>}
              {errors.recipeUse?.type === "minLength" && <p className='no-valid'>Debes dar una mejor explicación</p>}
            </div>

            <div className="form-group">
              <select id="teacher-year-select" className="form-select user-type-select"
                {...register("pacient", { required: true, onChange: selectPacient })}>
                <option value="">Selecciona un paciente</option>
                {dbUsers.map((user: any, i) => (
                  user.type === 'Paciente' ? (
                    <option key={i} value={user.id}>{user.name}</option>
                  ): ('')
                ))}
              </select>
              {errors.pacient?.type === "required" && <p className="no-valid">Debe seleccionar un paciente</p>}
            </div>
          </div>
          <div className="buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button className="btn btn-secondary w-25" onClick={() => { handleClose() }}>Cancelar</button>
            <button className="btn btn-success w-25" type="submit" name="create">Crear</button>
          </div>
        </form>
      </MyModal>

      <MyModal title={currentRecipe.pacient ? `Receta para ${currentRecipe.pacient.name}`: ''} show={showView} hndClose={handleCloseView} hndShow={handleShowView}>
        <div className="recipe-view">
          <h3>Medicamento: {currentRecipe.medicine}</h3>
          <h3>Descripción de uso: {currentRecipe.useDescription}</h3>
        </div>
      </MyModal>

      <MyModal title="Editar Receta" show={showEdit} hndClose={handleCloseEdit} hndShow={handleShowEdit}>
        <form className="modal-form" onSubmit={
          handleSubmit2((dat, e) => {
            if (e) e.preventDefault();
            const requestOptions = {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                medicine: dat.medicine,
                useDescription: dat.recipeUse,
              })
            };
            fetch(`http://localhost:3333/recipes/${currentRecipe.id}/update`, requestOptions).then((res) => {
              res.json().then(async (e) => {
                if (e.error) {
                  await showAlert({ type: 'err', msg: e.message });
                } else {
                  await showAlert({ type: 'ok', msg: 'Receta editada' });
                  handleCloseEdit();
                  setUpdate(update+1);
                }
              }).catch(async (e) => {
                console.log(e);
              })
            }).catch(async (e) => {
              console.log(e);
              await showAlert({ type: 'err', msg: 'Error en la conexion con el servidor' });
            });
          })}>
          <div className='form-container'>
            <div className="form-group">
              <input className='form-control' id='recipe-medicine' type="text" placeholder="Nueva medicina"
                {...register2("medicine", { required: true })} />
              {errors2.medicine?.type === "required" && <p className='no-valid'>Debes escribir un medicamento</p>}
            </div>

            <div className="form-group">
              <input className='form-control' id='recipe-useDescription' type="text" placeholder="Nueva descripción de uso"
                {...register2("recipeUse", { required: true, minLength: 10 })} />
              {errors2.recipeUse?.type === "required" && <p className='no-valid'>Escribe la forma de usar el medicamento</p>}
              {errors2.recipeUse?.type === "minLength" && <p className='no-valid'>Debes dar una mejor explicación</p>}
            </div>
          </div>
          <div className="buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button className="btn btn-secondary w-25" onClick={ handleCloseEdit }>Cancelar</button>
            <button className="btn btn-success w-25" type="submit" name="create">Editar</button>
          </div>
        </form>
      </MyModal>
    </>
  );
}
