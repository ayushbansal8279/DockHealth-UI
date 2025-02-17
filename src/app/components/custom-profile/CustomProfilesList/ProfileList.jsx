import { showGlobalErrorAlert } from '@/app/alert/actions';
import { getAllProfiles, getProfileDetails } from '@/app/api/profile-api';
import { getProfileName } from '@/app/views/custom-profile-details/helpers';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Input, InputBox, NoResultText, Row, SearchProfilesResultList } from './styled';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import MagnifierIcon from 'img/magnifier.svg';

export default function ProfileList({ profileTypeIdentifier, profile, onSelect }) {
    const dispatch = useDispatch();
    const [profiles, setProfiles] = useState([]);
    const [profileTypeFields, setProfileTypeFields] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProfileTypeFields = useCallback(() => {
        getAllProfileFieldTypes(profileTypeIdentifier)
            .then(setProfileTypeFields)
            .catch(() => dispatch(showGlobalErrorAlert()));
    }, [dispatch, profileTypeIdentifier]);

    const fetchProfiles = useCallback(() => {
        getAllProfiles(profileTypeIdentifier)
            .then(setProfiles)
            .catch(() => dispatch(showGlobalErrorAlert()));
    }, [dispatch, profileTypeIdentifier]);

    useEffect(() => {
        fetchProfileTypeFields();
        fetchProfiles();
    }, [profileTypeIdentifier, fetchProfileTypeFields, fetchProfiles]);

    const getDisplayName = useCallback(
        (profile) => getProfileName(profileTypeFields, profile)?.[0] || profile.identifier,
        [profileTypeFields]
    );

    const handleProfileSelect = (selectedProfile) => {
        onSelect(
            { identifier: profile.identifier, displayName: getDisplayName(profile) },
            { identifier: selectedProfile.identifier, displayName: getDisplayName(selectedProfile) }
        );
    };

    const renderRow = (option) => {
        return (
            <Row
                key={option.identifier}
                type="button"
                onClick={() => {
                    handleProfileSelect(option);
                }}
            >
                {getDisplayName(option)}
            </Row>
        )
    }

    const filteredProfiles = profiles.filter(
        (option) =>
            option.fields?.length > 0 &&
            option.identifier !== profile.identifier &&
            getDisplayName(option).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <InputBox>
                <img src={MagnifierIcon} alt="magnifier" />
                <Input
                    placeholder="Search profiles"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputBox>
            <SearchProfilesResultList>
                {
                    filteredProfiles.length === 0
                        ? <NoResultText>No profiles found</NoResultText>
                        : filteredProfiles.map(renderRow)
                }
            </SearchProfilesResultList>
        </>
    )
}