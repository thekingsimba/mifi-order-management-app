import { styled } from '@mui/system';
import NotFoundImage from '../../assets/writer.svg';
const ErrorPageContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4rem',
    maxHeight: '100vh',
});

const ErrorImage = styled('img')({
    width: '20%',
    height: 'auto'
});

const ErrorMessage = styled('p')({
    marginTop: '0.5rem',
    fontSize: '2rem',
    lineHeight: '130%',
});

const ErrorMsgContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    gap: '1rem',

    '& .btn': {
        width: 'fit-content',
        border: 'none',
        padding: '2px 10px',
        background: '#bd1d3d',
        color: '#fff',
        letterSpacing: '1px',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
    },
});

const ErrorPage = ({ error, resetErrorBoundary }) => (
    <ErrorPageContainer className="error-page">
        <ErrorImage src={NotFoundImage} alt="Error" />
        <ErrorMsgContainer className="error-msg">
            <ErrorMessage>Something went wrong:</ErrorMessage>
            <pre>{error.message}</pre>
            <button className="btn" onClick={resetErrorBoundary}>Try again</button>
        </ErrorMsgContainer>
    </ErrorPageContainer>
);

export default ErrorPage;
