import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function App() {
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
                <Select>
                  <SelectTrigger id="card">
                    <SelectValue placeholder="Select a card" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="card1">xxxx-xxxx-xxxx-1234</SelectItem>
                    <SelectItem value="card2">xxxx-xxxx-xxxx-9876</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-green-600">Pay now!</Button>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}

export default App
