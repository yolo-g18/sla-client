import {GetStaticProps} from 'next';

const loginForm = () => {
    return (
        <div>
            Enter
        </div>
    );
}

export const getStaticProps:GetStaticProps = async (ctx) => {


    return {
        props:{
            data:null
        }
    }
}

export default loginForm;