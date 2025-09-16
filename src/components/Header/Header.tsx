// // 'use client';

// // import Link from 'next/link';
// // import { useEffect, useState } from 'react';
// // import styles from './Header.module.css';
// // import { signOut } from 'next-auth/react';

// // interface HeaderProps {
// //   isLoggedIn: boolean;
// // }

// // export default function Header({ isLoggedIn }: HeaderProps) {
// //   const [isSticky, setIsSticky] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsSticky(window.scrollY > 50);
// //     };

// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   return (
// //     <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
// //       <div className={styles.headerContent}>
// //         <h1 className={styles.logo}>REST Client</h1>

// //         <nav>
// //           {isLoggedIn ? (
// //             <Link href="/dashboard" className={styles.navLink}>
// //               Main Page
// //             </Link>
// //           ) : (
// //             <>
// //               <Link href="/auth/login" className={styles.navLink}>
// //                 Sign In
// //               </Link>
// //               {' | '}
// //               <Link
// //                 onClick={() => signOut({ callbackUrl: '/' })}
// //                 href="/auth/signup"
// //                 className={styles.navLink}
// //               >
// //                 Sign Up
// //               </Link>
// //             </>
// //           )}
// //         </nav>
// //       </div>
// //     </header>
// //   );
// // }

// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useSession, signOut } from 'next-auth/react';
// import styles from './Header.module.css';

// const Header = () => {
//   const { data: session, status } = useSession(); // Get session state from NextAuth
//   const [isSticky, setIsSticky] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 50);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Handle session loading, authenticated, and unauthenticated states
//   if (status === 'loading') {
//     return (
//       <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
//         <div className={styles.headerContent}>
//           <h1 className={styles.logo}>REST Client</h1>
//           <nav>
//             <p>Loading...</p> {/* Alternatively, you could add a spinner */}
//           </nav>
//         </div>
//       </header>
//     );
//   }

//   // Final check: is the user logged in?
//   const isLoggedIn = status === 'authenticated'; // Handle logged-in state

//   return (
//     <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
//       <div className={styles.headerContent}>
//         <h1 className={styles.logo}>REST Client</h1>

//         <nav>
//           {isLoggedIn ? (
//             <>
//               {/* Link to Main Page (Dashboard) */}
//               <Link href="/dashboard" className={styles.navLink}>
//                 Main Page
//               </Link>

//               {/* Logout Button */}
//               {' | '}
//               <button
//                 onClick={() => signOut({ callbackUrl: '/' })} // Redirect user to homepage after logout
//                 className={styles.navLink}
//               >
//                 Logout
//               </button>

//               {/* User Initial */}
//               <span className={styles.userInitial}>
//                 {session?.user?.name
//                   ? session.user.name[0]?.toUpperCase()
//                   : 'U'}{' '}
//                 {/* Defaults to 'U' if name is not available */}
//               </span>
//             </>
//           ) : (
//             <>
//               {/* Sign In Link */}
//               <Link href="/auth/login" className={styles.navLink}>
//                 Sign In
//               </Link>

//               {/* Sign Up Link */}
//               {' | '}
//               <Link href="/auth/signup" className={styles.navLink}>
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import styles from './Header.module.css';

// Define the Props interface and include the isLoggedIn prop
interface HeaderProps {
  isLoggedIn: boolean; // Required prop to indicate if the user is logged in
}

const Header = ({ isLoggedIn }: HeaderProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>REST Client</h1>

        <nav>
          {isLoggedIn ? (
            <>
              {/* Link to Main Dashboard Page */}
              <Link href="/dashboard" className={styles.navLink}>
                Main Page
              </Link>
              {' | '}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={styles.navLink}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={styles.navLink}>
                Sign In
              </Link>
              {' | '}
              <Link href="/signup" className={styles.navLink}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
