import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import gql from "graphql-tag";
import { useState } from "react";
import { useForgotPasswordMutation } from "../generated/graphql";
const ForgotPassword: React.FC<{}> = ({}) => {
  const [, forgorPassword] = useForgotPasswordMutation();

  const [complete, setComplete] = useState(false);

  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          const response = await forgorPassword(values);
          console.log(values)
          console.log(response);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>We are sending you the email!</Box>
          ) : (
            <Form>
              <InputField name="email" label="Email" placeholder="Email" />

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Send Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
