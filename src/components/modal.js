// @flow

import React from 'react';
import type { Element } from 'react';

type Props = {
  children?: Element<any>,
};

const Modal = ({ children }: Props) => <div className="modal">
  <div className="modal-dialog" role="document">
    {children}
  </div>
</div>;

Modal.defaultProps = {
  children: '',
};

export default Modal;
