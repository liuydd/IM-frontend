import React, { useEffect, useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX } from "../constants/string";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Card, Divider, Button } from "antd";
import AssignManager from "../pages/group/assign_manager";
import RemoveMember from "../pages/group/remove_member";
import TransferMonitor from "../pages/group/transfer_monitor";
import WithdrawGroup from "../pages/group/withdraw_group";
import EditAnnouncement from "../pages/group/edit_announcement";
import ListAnnouncement from "../pages/group/list_announcement";
import InviteMember from "../pages/group/invitation/send";
import GetInvitation from "../pages/group/invitation/get";

interface Group {
  groupid: number;
  groupname: string;
  monitor: string;
  managers: string[];
  members: string[];
  // announcements: string[];
}

function GroupList() {
  const userid = useSelector((state: RootState) => state.auth.userid);
  const username = useSelector((state: RootState) => state.auth.name);
  const token = useSelector((state: RootState) => state.auth.token);
  const [monitorGroup, setMonitorGroup] = useState<Group[]>([]);
  const [manageGroup, setManageGroup] = useState<Group[]>([]);
  const [memberOfGroup, setMemberOfGroup] = useState<Group[]>([]);

  const listGroup = () => {
    fetch(`${BACKEND_URL}/api/group/list?userid=${userid}`,{
        method: "GET",
        headers : {
          "Content-Type": "application/json",
          Authorization: `${token}`
        }
  })
      .then((res) => res.json())
      .then((res) => {
        if (Number(res.code) === 0) {
          // setGroups(res);
          setMonitorGroup(res.monitorGroup);
          setManageGroup(res.manageGroup);
          setMemberOfGroup(res.memberOfGroup);
        } else {
          alert(res.info);
        }
      })
      .catch((err) => alert(FAILURE_PREFIX + err));
  };

  return (
    <div>
      <Button onClick={listGroup}>List Group</Button>
      <h2>Groups You Monitor</h2>
      {monitorGroup && monitorGroup.map((group) => (
        <Card key={group.groupid} title={group.groupname}>
          <ListAnnouncement groupid = {group.groupid} />
          <GetInvitation groupid = {group.groupid} />
          <p>Monitor: {group.monitor}</p>
          <p><AssignManager groupmemberslist = {group.members} groupid ={group.groupid}/></p>
          <p><TransferMonitor groupmemberslist = {group.members} groupid ={group.groupid}/></p>
          <p><RemoveMember groupmemberslist = {group.members} groupid ={group.groupid}/></p>
          <p><EditAnnouncement groupid={group.groupid}/></p>
          <Divider>Managers</Divider>
          <ul>
            {group.managers.map((manager) => (
              <li key={manager}>{manager}</li>
            ))}
          </ul>
          <Divider>Members</Divider>
          <ul>
            {group.members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
          <InviteMember groupid = {group.groupid}/>
        </Card>
      ))}

      <h2>Groups You Manage</h2>
      {manageGroup && manageGroup.map((group) => (
        <Card key={group.groupid} title={group.groupname}>
          <ListAnnouncement groupid = {group.groupid} />
          <GetInvitation groupid = {group.groupid} />
          <p>Monitor: {group.monitor}</p>
          <Divider>Managers</Divider>
          <p><RemoveMember groupmemberslist = {group.members} groupid ={group.groupid}/></p>
          <ul>
            {group.managers.map((manager) => (
              <li key={manager}>{manager}</li>
            ))}
          </ul>
          <Divider>Members</Divider>
          <ul>
            {group.members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
          <InviteMember groupid = {group.groupid}/>
        </Card>
      ))}

      <h2>Groups You Are a Member Of</h2>
      {memberOfGroup && memberOfGroup.map((group) => (
        <Card key={group.groupid} title={group.groupname}>
          <p><WithdrawGroup groupid = {group.groupid}/></p>
          <ListAnnouncement groupid = {group.groupid} />
          <GetInvitation groupid = {group.groupid} />
          <p>Monitor: {group.monitor}</p>
          <Divider>Managers</Divider>
          <ul>
            {group.managers.map((manager) => (
              <li key={manager}>{manager}</li>
            ))}
          </ul>
          <Divider>Members</Divider>
          <ul>
            {group.members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
          <InviteMember groupid = {group.groupid}/>
        </Card>
      ))}
    </div>
  );
}

export default GroupList;
