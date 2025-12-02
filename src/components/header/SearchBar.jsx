import { InputBase } from '@mui/material';
import Grid from '@mui/material/Grid';

const SearchBar = () => {
    return (
        <Grid
            container
            alignItems="center"
            spacing={2}
            justifyContent={'flex-start'}
        >
            <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
            />
        </Grid>
    );
};

export default SearchBar;
