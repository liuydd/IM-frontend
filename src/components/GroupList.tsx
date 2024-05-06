import React, { useEffect, useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX } from "../constants/string";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Card, Divider } from "antd";

function GroupList() {
  const userid = useSelector((state: RootState) => state.auth.userid);
  const username = useSelector((state: RootState) => state.auth.name);
  const [groups, setGroups] = useState({
    monitorGroup: [],
    manageGroup: [],
    memberOfGroup: []
  });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/group/list_group?userid=${userid}`)
      .then((res) => res.json())
      .then((res) => {
        if (Number(res.code) === 0) {
          setGroups(res);
        } else {
          alert(res.info);
        }
      })
      .catch((err) => alert(FAILURE_PREFIX + err));
  });

  return (
    <div>
      
    </div>
  );
}

export default GroupList;
