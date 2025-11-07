import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button';

function Toggle() {

  const {theme,setTheme} = useTheme();

  return (
    <Button
     onClick={()=>setTheme(theme === 'light' ? 'dark' : 'light')}
     variant='outline' size='icon' className='rounded-full'>
      <Sun className='rotate-0 scale-100 dark:-rotate-90 dark:scale-0 h-10 w-10 absolute'/>
      <Moon className='rotate-90 scale-0 dark:rotate-0 dark:scale-100 h-10 w-10 absolute'/>
    </Button>
  )
}

export default Toggle