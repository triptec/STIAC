import React, { useEffect, useState } from "react";
import List from "../components/List";
export function ListScreen({ route }) {
  const list = route.params.list;
  return <List list={list} />;
}
