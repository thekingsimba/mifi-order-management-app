import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, Paper, Select } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const SearchInputContainer = styled(InputBase)(() => ({ marginLeft: "10px", flex: 1 }));
const SearchContainer = styled(Paper)(() => ({
  borderRadius: '8px !important',
  border: '1px solid #CCC',
  height: '32px',
  minWidth: 120,
  paddingBlock: '6px',
  paddingInline: '3px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
}));
const menuDropdown = [{ label: 'MSISDN', value: 'MSISDN' }];
export default function SearchInput() {
  const [dropdownValue, setDropdownValue] = useState(menuDropdown[0].label);

  const handleChange = (event) => {
    setDropdownValue(event.target.value);
  };
  return (
    <SearchContainer  size="small">
      <Select
        size="small"
        defaultValue={dropdownValue}
        labelId="demo-select-small-label"
        id="demo-select-small"
        onChange={handleChange}
      >
        {menuDropdown.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <SearchInputContainer
        placeholder="232323"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </SearchContainer>
  );
}
