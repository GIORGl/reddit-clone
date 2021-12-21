import { Box, Heading } from "@chakra-ui/layout";
import { defaultMaxListeners } from "events";
import { cloneWith } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching,error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if(error) {
      console.log(error.message)
  }
  if (fetching) {
    return (
      <Layout variant='regular'>
        <div>loading...</div>
      </Layout>
    );
  }

  if(!data?.getPost) {
      return <h1>could not find the post</h1>
  }
  return (
    <Layout variant='regular'>
    
    <Heading mb={4}>{data.getPost.title}</Heading>
      <Box mb={4}>{data.getPost.text}</Box>
   
    
</Layout>
  )
}

export default Post;
