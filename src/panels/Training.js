import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import bridge from '@vkontakte/vk-bridge';
import access, {DEFAULT} from '../utils/access';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";

const Training = ({id, go, fetchedUser, child_id, group_id, organization_id}) => {

    const [child, setChild] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [group, setGroup] = useState(null)

    useEffect(() => {
        bridge.send('VKWebAppGetGroupInfo', { group_id }).then((groupData) => {
            setGroup(groupData)
        })
        bridge.send('VKWebAppGetGroupInfo', {'group_id': organization_id}).then((organizationData) => {
            setOrganization(organizationData)
        })

        async function fetchChild () {
            const data = await bridge.send('VKWebAppCallAPIMethod', {'method': 'users.get', 'params': {
                'user_ids': child_id,
                'access_token': `${await access.getAccessToken(DEFAULT)}`
            }})

            if (!(data["type"] === "VKWebAppCallAPIMethodResult"))
                throw new Error("Ошибка вызова VK.API")

            setChild(data["data"]["response"])
        }

        fetchChild()

    })

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={go} data-to="home"/>}
            >
                Обучение
            </PanelHeader>

            {organization && group &&
            <Cell
                before={organization.photo_200 ? <Avatar src={organization.photo_200}/> : null}
                description={group.name ? group.name : ''}
            >
                {organization.name}
            </Cell>}


        </Panel>
    );
}
//<img className="Persik" src={persik} alt="Persik The Cat"/>
Training.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,

    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),

    organization_id: PropTypes.string.isRequired,
    group_id: PropTypes.string.isRequired,
    child_id: PropTypes.string.isRequired
};

/*
organization: PropTypes.shape({
        name: PropTypes.string,
        photo_200: PropTypes.string,
        id: PropTypes.number,
        screen_name: PropTypes.string
    }).isRequired
 */

export default Training;
