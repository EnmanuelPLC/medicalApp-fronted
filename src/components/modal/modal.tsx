import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function MyModal(props: {title: string, show: boolean, hndClose: any, hndShow: any, children: React.ReactElement}) {

  return (
    <>
      <Modal show={props.show} onHide={props.hndClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.children}
        </Modal.Body>
      </Modal>
    </>
  );
}
