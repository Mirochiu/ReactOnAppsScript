import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const NAME_OF_PAGE = 'reactonappscript.page';

const PagesController = ({
  pages,
  initPage,
  buildTopNavigator = () => {},
  buildBottomNavigator = () => {},
  onPageChanged = () => {},
  lastPageAction,
}) => {
  const [curPage, setPage] = useState(null);
  const { logout } = useAuth();
  const goPage = (p) => setPage(p);
  const defaultHandler = (page) =>
    onPageChanged({
      page,
      goPage,
      logout,
    });

  useEffect(() => {
    if (lastPageAction && pages) {
      console.debug('lastPageAction', lastPageAction);
      const targetPair = Object.entries(pages).find((pair) => {
        const [key, page] = pair;
        console.debug(key, page, page.action == lastPageAction);
        return page.action == lastPageAction;
      });
      if (targetPair) {
        console.debug('found lastPage', targetPair[1]);
        setPage(targetPair[1]);
        return;
      }
    }

    if (initPage) setPage(initPage);
  }, [pages, lastPageAction]);

  useEffect(() => {
    // save current page
    const action = curPage?.action;
    if (action) {
      sessionStorage.setItem(NAME_OF_PAGE, action);
      console.debug('save page', action);
    }
  }, [curPage])

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
