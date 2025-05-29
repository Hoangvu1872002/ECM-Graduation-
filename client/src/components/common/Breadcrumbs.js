import React, { memo } from "react";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import icons from "../../ultils/icons";

const Breadcrumbs = ({ title, category }) => {
  const { IoIosArrowForward } = icons;
  const routes = [
    { path: "/:category", breadcrumb: category },
    { path: "/", breadcrumb: "Home" },
    { path: "/:category/:pid/:title", breadcrumb: title },
  ];
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <div className="text-sm flex items-center gap-1">
      {breadcrumbs
        ?.filter((e) => !e.match.route === false)
        .map(({ match, breadcrumb }, index, self) => (
          <Link
            className="flex gap-1 items-center hover:text-main"
            key={match.pathname}
            to={match.pathname}
          >
            <span className="capitalize">{breadcrumb}</span>
            {index !== self.length - 1 && (
              <IoIosArrowForward></IoIosArrowForward>
            )}
          </Link>
        ))}
    </div>
  );
};

export default memo(Breadcrumbs);
