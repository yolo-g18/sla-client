import { GetStaticProps } from "next";

const index = () => {
  return <div>Enter</div>;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default index;
