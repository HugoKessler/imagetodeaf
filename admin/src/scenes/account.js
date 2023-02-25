import React, { useEffect, useState } from "react";
import { Container, FormGroup, Input, Label, Button, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { toastr } from "react-redux-toastr";

import api from "../services/api";
import LoadingButton from "../components/loadingButton";
import ImageInput from "../components/ImageInput";

export default () => {
  const user = useSelector((state) => state.Auth.user);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Container style={{ padding: "40px 15px" }}>
        <Formik
          initialValues={user}
          onSubmit={async (values) => {
            try {
              await api.put(`/user?user_id=${user._id}`, values);
              toastr.success("Updated!");
            } catch (e) {
              console.log(e);
              toastr.error("Some Error!");
            }
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <React.Fragment>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input name="name" value={values.name} onChange={handleChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input disabled name="email" value={values.email} onChange={handleChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <ImageInput
                      onUpload={async (url) => {
                        await api.put(`/publisher`, { avatar: url });
                        toastr.success("success");
                      }}
                      onError={(error) => toastr.error(error)}
                      url={values.avatar}
                      route={`/user/image?user_id=${user._id}`}
                    />
                  </FormGroup>
                  <ChangePassword />
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Role</Label>
                    <Input disabled name="role" value={values.role} />
                  </FormGroup>
                </Col>
              </Row>
              <hr />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton loading={isSubmitting} color="info" onClick={handleSubmit}>
                  Update
                </LoadingButton>
              </div>
            </React.Fragment>
          )}
        </Formik>
      </Container>
    </div>
  );
};

const ChangePassword = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button style={{ padding: "15px 0" }} color="link" onClick={() => setOpen(true)}>
        Change password
      </Button>

      <Modal isOpen={open} toggle={() => setOpen(false)} className="change-password">
        <ModalHeader>Change password</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ password: "", newPassword: "", verifyPassword: "" }}
            onSubmit={async (values, actions) => {
              try {
                const res = await api.post(`/user/reset_password`, values);
                if (!res.ok) throw res;
                toastr.success("Password changed!");
                setOpen(false);
              } catch (e) {
                console.log("error", e.code);
                toastr.error("error", e.code);
              }
              actions.setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, handleChange, handleSubmit }) => {
              return (
                <div autoComplete="off">
                  <FormGroup>
                    <label>Password</label>
                    <Input name="password" type="password" value={values.password} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label>New Password</label>
                    <Input name="newPassword" type="password" value={values.newPassword} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label>Re-type Password</label>
                    <Input name="verifyPassword" type="password" value={values.verifyPassword} onChange={handleChange} />
                  </FormGroup>
                  <Button type="submit" color="info" disabled={isSubmitting} onClick={handleSubmit}>
                    Update
                  </Button>
                </div>
              );
            }}
          </Formik>
        </ModalBody>
      </Modal>
    </div>
  );
};
