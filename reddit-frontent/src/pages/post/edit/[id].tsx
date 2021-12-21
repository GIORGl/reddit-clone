import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import router from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
// import { useGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({}) => {
  const intId = useGetIntId();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [_, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout variant="regular">
        <div>loading...</div>
      </Layout>
    );
  }

  
  if (!data?.getPost) {
    return (
      <Layout variant='regular'>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data.getPost.title,
          text: data.getPost.text,
        }}
        onSubmit={async ({ text, title }) => {
          await updatePost({ id: intId, text, title });
          router.push('/')
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button mt={4} type="submit" color="white" colorScheme="teal">
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
