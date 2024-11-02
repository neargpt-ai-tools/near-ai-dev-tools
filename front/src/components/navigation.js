import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';

import { NearContext } from '@/wallets/near';
import NearLogo from '/public/logo-NEARGPT.png';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Connect Wallet');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid flex items-center justify-between">
        <Link href="/" passHref legacyBehavior>
          <Image
            priority
            src={NearLogo}
            alt="NEAR"
            width="180"
            height="50"
            className="d-inline-block align-text-top"
          />
        </Link>
        <div className='navbar-nav pt-1 mr-5'> {/* Add margin-left here */}
          <button
            className="btn btn-secondary"
            onClick={action}
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
