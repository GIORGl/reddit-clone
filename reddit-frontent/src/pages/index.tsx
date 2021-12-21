import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Link } from "@chakra-ui/layout";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { truncate } from "../utils/truncate";
import { IconButton } from "@chakra-ui/react";
import { UpdootSection } from "../components/UpdootSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{data:MeData}] = useMeQuery()
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [, deletePost] = useDeletePostMutation();
  // console.log(data?.getPosts)

  if (!fetching && !data) {
    return <div>Queyry failed</div>;
  }
  return (
    <Layout variant="regular">
      <Flex align="center">
        <Heading>Posts</Heading>
        <NextLink href="/create-post">
          <Link ml={"auto"}>Create Post</Link>
        </NextLink>
      </Flex>

      <br />
      {fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.getPosts.posts.map((post) =>
            !post ? null : (
              <>
                {/* <div key={post.id}>{post.title}</div> */}

                <Flex
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  flex="1"
                  borderRadius="md"
                  key={post.id}
                >
                  <UpdootSection post={post} />

                  <Box flex={1}>
                    <NextLink href="post/[id]" as={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize="xl">{post.title}</Heading>
                      </Link>
                    </NextLink>
                    posted by {post.creator.username}
                    <Text flex={1} mt={4}>
                      {truncate(post.text, 100)}
                    </Text>
                  </Box>
                 {MeData?.me?.id !== post.creator.id ? null : <Box>
                    <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
                      <IconButton
                        mr={4}
                        as={Link}
                        color="white"
                        colorScheme="yellow"
                        icon={<EditIcon />}
                        aria-label="Edit"
                      />
                    </NextLink>

                    <IconButton
                      color="white"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                      aria-label="Delete"
                      onClick={() => {
                        deletePost({ id: post.id });
                      }}
                    />
                  </Box>}
                </Flex>
              </>
            )
          )}
        </Stack>
      )}

      {data ? (
        <Flex>
          {data.getPosts.hasMore && (
            <Button
              onClick={() => {
                setVariables({
                  limit: 50,
                  cursor:
                    data.getPosts.posts[data.getPosts.posts.length - 1]
                      .createdAt,
                });

                console.log(data.getPosts.hasMore);
              }}
              isLoading={fetching}
              m={"auto"}
              my={8}
            >
              Load more
            </Button>
          )}
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
