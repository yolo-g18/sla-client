import {GetStaticProps} from 'next';

const register = () => {
    return (
        <div>
            
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

export default register;