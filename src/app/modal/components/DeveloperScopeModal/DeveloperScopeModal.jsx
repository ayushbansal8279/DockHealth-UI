import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Collapse, List, Checkbox, IconButton } from '@mui/material';
import { 
  ModalWrapperWithPadding, 
  Container, 
  FlexButtonWrapper, 
  CancelButton, 
  ConfirmButton, 
  Title, 
  ListsWrapper, 
  CloseIconButton,
  CloseIcon,
  NextArrow,
  Step,
  ScopeList,
  NestedList,
  ScopeCheckbox,
  ScopeName,
  ScopeListCategoryName,
  ScopeHeadingContainer,
  ScopeListItemName
} from './styled';
import { useDispatch } from 'react-redux';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';
import { closeModal } from '../../actions';
import { getDeveloperOauthScopes } from '@/app/api/developers-api';

const DeveloperScopeModal = ({ onConfirm, confirmText = 'Confirm' }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScopes, setSelectedScopes] = useState([]);

  const handleClose = () => dispatch(closeModal());

  useEffect(() => {
    const fetchScopes = async () => {
      try {
        const response = await getDeveloperOauthScopes();
        setCategories(categorizeScopes(response?.scopes));
      } catch (err) {
        console.error(err);
      }
    };
    fetchScopes();
  }, []);

  const categorizeScopes = (scopes) => {
    const categories = {};
    scopes.forEach((scope) => {
      const parts = scope.split('/')[1].split('.');
      if (parts.length >= 2) {
        const [resource, access] = parts;
        if (!categories[resource]) categories[resource] = { read: [], write: [] };
        if (access === 'read' || access === 'write') {
          categories[resource][access].push(scope);
        }
      }
    });
    return categories;
  };

  const handleScopeSelect = (scope) => {
    setSelectedScopes(prev => 
      prev.includes(scope) 
        ? prev.filter(s => s !== scope) 
        : [...prev, scope]
    );
  };

  const filteredCategories = Object.keys(categories)
    .filter(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map(category => category.charAt(0).toUpperCase() + category.slice(1));

  const handleConfirm = useCallback((scopes) =>{
    if (onConfirm) onConfirm(scopes);
    handleClose();
  });

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={handleClose} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <Step>
          <Title>Select Scopes</Title>
          <Box m={1} />
          <Box sx={{ width: '100%', mx: 'auto' }}>
            <HeaderSearch 
              onChange={setSearchQuery} 
            />
          </Box>
          <Box m={0.5} />
          
          <ListsWrapper>
            <ScopeList>
              {filteredCategories.map((category) => {
                const lowerCaseCategory = category.toLowerCase();
                return (
                  <React.Fragment key={category}>
                    <ScopeHeadingContainer>
                      <ScopeListCategoryName >
                        <ScopeName>{category}</ScopeName>
                      </ScopeListCategoryName>
                    </ScopeHeadingContainer>
                      <NestedList>
                        {categories[lowerCaseCategory]?.read.map(scope => (
                          <ScopeHeadingContainer key={scope}>
                            <ScopeListItemName>
                              <ScopeCheckbox
                                checked={selectedScopes.includes(scope)}
                                onChange={() => handleScopeSelect(scope)}
                                size="small"
                              />
                              <ScopeName>{scope}</ScopeName>
                            </ScopeListItemName>
                          </ScopeHeadingContainer>
                        ))}
                        {categories[lowerCaseCategory]?.write.map(scope => (
                          <ScopeHeadingContainer key={scope}>
                            <ScopeListItemName>
                              <ScopeCheckbox
                                checked={selectedScopes.includes(scope)}
                                onChange={() => handleScopeSelect(scope)}
                                size="small"
                              />
                              <ScopeName>{scope}</ScopeName>
                            </ScopeListItemName>
                          </ScopeHeadingContainer>
                        ))}
                      </NestedList>
                  </React.Fragment>
                );
              })}
            </ScopeList>
          </ListsWrapper>
        </Step>
      </Container>
      <Box m={1} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <CancelButton
            style={{ width: '190px' }}
            fullWidth
            variant="secondary"
            onClick={handleClose}
            size="small"
          >
            Cancel
          </CancelButton>
          <Box m={1} />
          <ConfirmButton
            style={{ width: '190px' }}
            fullWidth
            disabled={selectedScopes.length === 0}
            size="small"
            onClick={() => handleConfirm(selectedScopes)}
          >
            {confirmText || 'Save'}
          </ConfirmButton>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default DeveloperScopeModal;