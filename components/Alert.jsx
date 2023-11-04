import Link from "next/link";
import React from "react";
import { Alert } from "react-bootstrap"

const AlertScreen = ({ texto, url, urlTxt}) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="mt-5">
        <Alert variant="info">
            <Alert.Heading>{texto}</Alert.Heading>
            <hr />
            <p className="mb-0">
                No puedes acceder a esta página.
            </p>
            <Link href={`${url}`} className="btn btn-primary mt-2">
                {urlTxt}
            </Link>
        </Alert>
      </div>
    </div>
  );
};

export default AlertScreen;
