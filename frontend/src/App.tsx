import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react';

type PostData = {
  userId: string;
  cardNumber: string;
};

function App() {
  const [selectedCard, setSelectedCard] = useState<string>('Select a card');
  
  const handleClick = async () => {
    const body: PostData = {
      userId: '1',
      cardNumber: selectedCard,
    };
    const response = await fetch('http://localhost:5002/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data: string = await response.text();
    alert(data);
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Submit your payment</CardTitle>
          <CardDescription>Select one of your payment cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="card">Card details</Label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger id="card">
                    <SelectValue placeholder={selectedCard} >{selectedCard}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Select a card"> </SelectItem>
                    <SelectItem value="****-****-****-1234">****-****-****-1234</SelectItem>
                    <SelectItem value="****-****-****-9876">****-****-****-9876</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleClick} className="bg-green-600">Pay now!</Button>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

export default App
