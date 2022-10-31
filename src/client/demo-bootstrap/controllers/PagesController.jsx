import React, { useState, useMemo } from 'react';
import useAuth from '../hooks/useAuth';

const PagesController = ({
  pages,
  initPage,
  buildTopNavigator = () => {},
  buildBottomNavigator = () => {},
  onPageChanged = () => {},
}) => {
  const [curPage, setPage] = useState(initPage);
  const { logout } = useAuth();
  const goPage = (p) => setPage(p);
  const defaultHandler = (page) =>
    onPageChanged({
      page,
      goPage,
      logout,
    });

  const TopNav = useMemo(
    () =>
      buildTopNavigator({
        pages,
        goPage,
        logout,
        defaultHandler,
      }),
    [pages]
  );

  const BotNav = useMemo(
    () =>
      buildBottomNavigator({
        pages,
        goPage,
        logout,
        defaultHandler,
      }),
    [pages]
  );

  const FooterNav = useMemo(
    () =>
      React.cloneElement(BotNav, {
        pageFooter: true,
        isInvisible: true,
      }),
    [BotNav]
  );

  return (
    <>
      {TopNav}
      {curPage?.comp}
      {FooterNav}
      {BotNav}
    </>
  );
};

export default PagesController;
