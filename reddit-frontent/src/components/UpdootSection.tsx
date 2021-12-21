import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostsQuery } from "../generated/graphql";
import { useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostsQuery["getPosts"]["posts"][0];
}

// const [, vote] = useVoteMutation();

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      marginRight={4}
    >
      <Box>
        <IconButton
        //   onClick={() => {
        //     vote({
        //       value: 1,
        //       postId: post.id,
        //     });
        //   }}
          aria-label="Upwote"
        >
          <ChevronUpIcon size="24px" />
        </IconButton>
      </Box>
      <Box>{post.points}</Box>
      <Box>
        <IconButton
        //   onClick={() => {
        //     vote({
        //       value: -1,
        //       postId: post.id,
        //     });
        //   }}
          aria-label="downvote"
        >
          <ChevronDownIcon size="24px" />
        </IconButton>
      </Box>
    </Flex>
  );
};
