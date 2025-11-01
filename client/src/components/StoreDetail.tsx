import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Edit,
  Trash2,
  MapPin,
  Clock,
  User2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Monitor,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getStoreById,
  getOwnerById,
  getScreensByStoreId,
  getPublishHistoryByStoreId,
  mockOwners,
  type Store,
  type StoreOwner,
} from "@/lib/mockStoreData";
import StoreFormModal from "./StoreFormModal";
import StoreOwnerModal from "./StoreOwnerModal";
import StoreScreensTable from "./StoreScreensTable";
import { cn } from "@/lib/utils";

interface StoreDetailProps {
  storeId: string;
  onBack: () => void;
  onUpdate: (store: Store) => void;
  onDelete: (storeId: string) => void;
}

export default function StoreDetail({
  storeId,
  onBack,
  onUpdate,
  onDelete,
}: StoreDetailProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<StoreOwner | undefined>();
  const [storeUsers, setStoreUsers] = useState<StoreOwner[]>([]);

  const store = getStoreById(storeId);
  const owner = store ? getOwnerById(store.ownerId) : undefined;
  const screens = getScreensByStoreId(storeId);
  const publishHistory = getPublishHistoryByStoreId(storeId);

  // Initialize store users (owner + additional managers)
  useState(() => {
    if (owner) {
      setStoreUsers([owner]);
    }
  });

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Store not found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The store you're looking for doesn't exist.
        </p>
        <Button onClick={onBack}>Back to Stores</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getPublishStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getPublishStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-3 w-3" />;
      case "failed":
        return <XCircle className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleDelete = () => {
    onDelete(storeId);
    toast({
      title: "Store Deleted",
      description: `${store.name} has been deleted successfully`,
    });
  };

  const handleAddUser = (newUser: Omit<StoreOwner, "id"> | StoreOwner) => {
    const user: StoreOwner = {
      ...newUser,
      id: "id" in newUser ? newUser.id : `user-${Date.now()}`,
    } as StoreOwner;
    
    if ("id" in newUser && storeUsers.find(u => u.id === newUser.id)) {
      setStoreUsers(storeUsers.map(u => u.id === newUser.id ? user : u));
    } else {
      setStoreUsers([...storeUsers, user]);
    }
  };

  const handleEditUser = (user: StoreOwner) => {
    setSelectedOwner(user);
    setIsOwnerModalOpen(true);
  };

  const handleRemoveUser = (userId: string) => {
    setStoreUsers(storeUsers.filter(u => u.id !== userId));
    toast({
      title: "User Removed",
      description: "User has been removed from this store",
    });
  };

  const uptimePercentage = store.screensTotal > 0
    ? Math.round((store.screensOnline / store.screensTotal) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={onBack}
              className="cursor-pointer hover:text-primary"
            >
              Stores
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{store.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <Badge
                variant="outline"
                className={cn("capitalize", getStatusColor(store.status))}
              >
                {store.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{store.city}, {store.region}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Health Overview */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Screens</p>
                <p className="text-2xl font-bold">{store.screensTotal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {store.screensOnline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {store.screensTotal - store.screensOnline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{uptimePercentage}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="screens">Screens</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="publish">Publish History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address || `${store.city}, ${store.region}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Timezone</p>
                    <p className="text-sm text-muted-foreground">
                      {store.timezone}
                    </p>
                  </div>
                </div>

                {store.openingHours && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Opening Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {store.openingHours}
                      </p>
                    </div>
                  </div>
                )}

                {store.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {store.phone}
                      </p>
                    </div>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {store.email}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {owner ? (
                  <>
                    <div className="flex items-start gap-3">
                      <User2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">
                          {owner.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-0.5">
                        {owner.role}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Role</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {owner.email}
                        </p>
                      </div>
                    </div>

                    {owner.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {owner.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Region</p>
                        <p className="text-sm text-muted-foreground">
                          {owner.region}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No owner information available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {store.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {store.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Screens Tab */}
        <TabsContent value="screens">
          <StoreScreensTable
            screens={screens}
            onView={(screenId) => {
              toast({
                title: "View Screen",
                description: `Viewing screen ${screenId}`,
              });
            }}
            onEdit={(screenId) => {
              toast({
                title: "Edit Screen",
                description: `Editing screen ${screenId}`,
              });
            }}
            onRemove={(screenId) => {
              toast({
                title: "Screen Removed",
                description: "Screen has been removed from this store",
              });
            }}
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Store Users
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedOwner(undefined);
                  setIsOwnerModalOpen(true);
                }}
              >
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storeUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{user.role}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {storeUsers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publish History Tab */}
        <TabsContent value="publish">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Publish History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publishHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Send className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No publish history
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No content has been published to this store yet.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content Name</TableHead>
                        <TableHead>Published By</TableHead>
                        <TableHead>Published At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publishHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.contentName}
                          </TableCell>
                          <TableCell>{item.publishedBy}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.publishedAt}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "capitalize",
                                getPublishStatusColor(item.status)
                              )}
                            >
                              <div className="flex items-center gap-1">
                                {getPublishStatusIcon(item.status)}
                                {item.status}
                              </div>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <StoreFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedStore) => {
          onUpdate(updatedStore as Store);
        }}
        store={store}
      />

      {/* Owner Modal */}
      <StoreOwnerModal
        open={isOwnerModalOpen}
        onClose={() => {
          setIsOwnerModalOpen(false);
          setSelectedOwner(undefined);
        }}
        onSave={handleAddUser}
        owner={selectedOwner}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {store.name} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Store
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

