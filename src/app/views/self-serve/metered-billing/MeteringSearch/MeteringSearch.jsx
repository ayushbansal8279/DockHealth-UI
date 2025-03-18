import SearchInput from '@/app/components/common/SearchInput/SearchInput';
import { useState } from 'react';

const MeteringSearch = () => {
  const [currentSearch, setCurrentSearch] = useState('');
  return (
    <div style={{width:'10%'}} >
      <SearchInput value={currentSearch} onValueChange={setCurrentSearch} />
    </div>
  );
};

export default MeteringSearch;
