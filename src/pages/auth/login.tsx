import {GetStaticProps} from 'next';

const login = () => {
    return (
        <div>
            Login
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

export default login;