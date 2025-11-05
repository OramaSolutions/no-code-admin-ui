import React from 'react';
import { MoonLoader } from 'react-spinners';

function Loader({item}) {
    return (
        <div style={{ marginLeft: item?item:'400px' }}>
          <MoonLoader color={'#123abc'}  size={50} />
        </div>
    );
}

export default Loader;