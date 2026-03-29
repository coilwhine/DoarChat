import type { ReactElement } from "react";
import "./Footer.scss";

function Footer(): ReactElement {
  return (
    <footer className="AppFooter">
      <div className="inner">
        <div className="brand">Israel Post Chat</div>
        <div className="meta">(c) 2026 Israel Post Chat - Daniel Hen</div>
      </div>
    </footer>
  );
}

export default Footer;
